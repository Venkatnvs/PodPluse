from rest_framework.views import APIView
import hashlib
import os
import tempfile
from concurrent.futures import ThreadPoolExecutor,as_completed,wait
from django.core.cache import cache
from django.http import HttpResponse
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated
from TTS.api import TTS
from pydub import AudioSegment
from rest_framework.response import Response
from rest_framework import status
from langchain_text_splitters import RecursiveCharacterTextSplitter
from googletrans import Translator
from datetime import datetime

# Initialize the TTS model
tts = TTS(model_name="tts_models/multilingual/multi-dataset/xtts_v2", progress_bar=True)

available_languages =  tts.languages

class CreatePodcastAudioTTS(APIView):
    # permission_classes = [IsAuthenticated]

    @staticmethod
    def process_chunk(sentence, speaker_wav, language="en"):
        sentence_temp_file = tempfile.mktemp(suffix='.wav')
        tts.tts_to_file(
            sentence, 
            file_path=sentence_temp_file, 
            speaker_wav=speaker_wav, 
            language=language,
        )
        chunk_audio = AudioSegment.from_wav(sentence_temp_file)
        os.remove(sentence_temp_file)
        return chunk_audio
    
    def translate_text(self, text, target_language):
        translator = Translator()
        translated = translator.translate(text, dest=target_language)
        return translated.text
    
    def text_splitter(self, text):
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=200,
            chunk_overlap=0,
            length_function=len,
            is_separator_regex=False,
        )
        return text_splitter.split_text(text)
    
    def combine_audio_chunks(self, sentences, speaker_wav, target_language):
        if not sentences:
            raise ValueError("The sentences list is empty")

        combined_audio = AudioSegment.empty()

        starttime = datetime.now()

        # Process the first chunk
        if len(sentences) > 0:
            first_chunk_audio = self.process_chunk(sentences[0], speaker_wav, target_language)
            combined_audio += first_chunk_audio

        # Process the remaining chunks if they exist
        if len(sentences) > 1:
            with ThreadPoolExecutor() as executor:
                chunk_audios = list(executor.map(lambda s: self.process_chunk(s, speaker_wav, target_language), sentences[1:]))
                for chunk_audio in chunk_audios:
                    combined_audio += chunk_audio

        # if len(sentences) > 1:
        #     with ThreadPoolExecutor() as executor:
        #         # Submit tasks and map futures to their indices
        #         futures_to_index = {executor.submit(self.process_chunk, s, speaker_wav, target_language): i for i, s in enumerate(sentences)}

        #         # Wait for all futures to complete and process results
        #         chunk_audios = [None] * len(sentences)
        #         for future in as_completed(futures_to_index.keys()):
        #             index = futures_to_index[future]
        #             try:
        #                 chunk_audio = future.result()
        #                 if chunk_audio:
        #                     print(f"Received audio for index {index}")  # Debugging statement
        #                     chunk_audios[index] = chunk_audio
        #                 else:
        #                     print(f"Warning: No audio received for index {index}")
        #                     # Optionally handle cases where no audio is returned
        #                     chunk_audios[index] = AudioSegment.silent(duration=1000)
        #             except Exception as e:
        #                 print(f"An error occurred while processing index {index}: {e}")
        #                 # Handle the case where an error occurs, assigning a fallback silent segment
        #                 chunk_audios[index] = AudioSegment.silent(duration=1000)

        #         # Combine audio chunks in the order of sentences
        #         for chunk_audio in chunk_audios:
        #             if chunk_audio:
        #                 combined_audio += chunk_audio

        print(f"\n\n\nTime taken: {datetime.now() - starttime}\n\n\n")

        temp_file_name = tempfile.mktemp(suffix='.wav')
        combined_audio.export(temp_file_name, format="wav")
        del combined_audio
        return temp_file_name
    
    def check_cache_audio(self, cache_key):
        cached_audio = cache.get(cache_key)
        if cached_audio:
            response = HttpResponse(cached_audio, content_type='audio/mpeg')
            response['Content-Disposition'] = 'inline; filename="podcast.mp3"'
            return response
        return None
    
    def convert_wav_correctly(self, input_file_path):
        audio = AudioSegment.from_file(input_file_path)
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_wav_file:
            wav_file_path = temp_wav_file.name
        audio.export(wav_file_path, format="wav")
        return wav_file_path
    
    def post(self, request):
        try:
            voice_text = request.POST.get('voicePrompt').strip()
            voice_type = request.POST.get('voiceType').lower()
            target_language = request.POST.get('language', 'en')

            if voice_type == "custom":
                ctm_audio_file = request.FILES.get('customAudio')
                if not ctm_audio_file:
                    return Response({"error": "Custom audio file is required"}, status=status.HTTP_400_BAD_REQUEST)
                try:
                    with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_file:
                        for chunk in ctm_audio_file.chunks():
                            temp_file.write(chunk)
                        temp_file.flush()
                        temp_file.seek(0)
                
                    wav_file_path = self.convert_wav_correctly(temp_file.name)

                    speaker_wav = wav_file_path

                except Exception as e:
                    return Response({"error": f"Failed to save custom audio file: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                speaker_wav = f'Speakers/{voice_type}.wav'  # Update with the actual path to the user's voice sample

            if not voice_text:
                return Response({"error": "Voice text is required"}, status=status.HTTP_400_BAD_REQUEST)

            cache_key = hashlib.md5(f"{voice_text}_{target_language}_{speaker_wav}".encode()).hexdigest()
            cached_audio = self.check_cache_audio(cache_key)
            if cached_audio:
                return cached_audio
            
            if target_language not in available_languages:
                return Response({"error": f"Language '{target_language}' is not supported"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Translate the voice text
            translated_voice_text = self.translate_text(voice_text, target_language)

            # Split the translated text into sentences
            sentences = self.text_splitter(translated_voice_text)
            # sentences = [translated_voice_text]

            temp_file_name = self.combine_audio_chunks(sentences, speaker_wav, target_language)

            with open(temp_file_name, 'rb') as audio_file:
                audio_content = audio_file.read()

            os.remove(temp_file_name)
            cache.set(cache_key, audio_content, timeout=300)  # Cache the audio for 5 minutes

            response = HttpResponse(audio_content, content_type='audio/mpeg')
            response['Content-Disposition'] = 'inline; filename="podcast.mp3"'
            return response

        except Exception as e:
            print(e)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetAvailableLanguages(request):
    return Response(available_languages, status=status.HTTP_200_OK)