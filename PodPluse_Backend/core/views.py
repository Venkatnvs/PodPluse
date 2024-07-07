import pyttsx3
import tempfile
from django.http import HttpResponse
from rest_framework.decorators import api_view
import os
import io
from rest_framework.response import Response
from rest_framework import status
from transformers import pipeline
from TTS.api import TTS
from pydub import AudioSegment, exceptions as pydub_exceptions
import nltk
from diffusers import StableDiffusionPipeline
import torch
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from langchain_text_splitters import RecursiveCharacterTextSplitter
from django.core.cache import cache
import hashlib
from concurrent.futures import ThreadPoolExecutor

# device = "cuda" if torch.cuda.is_available() else "cpu"
# nltk.download('punkt')

@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def PodCastGenerator(request):
    try:
        if request.method == 'GET':
            voice_text = request.GET.get('voicePrompt')
        elif request.method == 'POST':
            voice_text = request.data.get('voicePrompt')
        else:
            return Response({"error": "Invalid request method"}, status=status.HTTP_400_BAD_REQUEST)

        if not voice_text:
            return Response({"error": "Voice text is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Initialize the text-to-speech engine
        engine = pyttsx3.init()

        voices = engine.getProperty('voices')

        engine.setProperty('voice', voices[1].id)

        # Set properties for human-like voice (optional)
        engine.setProperty('rate', 150)  # Speed percent (can go over 100)
        engine.setProperty('volume', 0.9)  # Volume 0-1

        # Save the generated audio to a temporary file
        temp_file_name = tempfile.mktemp(suffix='.mp3')
        engine.save_to_file(voice_text, temp_file_name)
        engine.runAndWait()

        # Read the temporary file and send it back as a response
        with open(temp_file_name, 'rb') as audio_file:
            audio_content = audio_file.read()

        os.remove(temp_file_name)

        response = HttpResponse(audio_content, content_type='audio/mpeg')
        response['Content-Disposition'] = 'inline; filename="podcast.mp3"'
        return response

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Initialize the text-to-speech engine
# tts = TTS(model_name="tts_models/en/ek1/tacotron2", progress_bar=True)

# print all available models

# def process_chunk(sentence):
#     sentence_temp_file = tempfile.mktemp(suffix='.wav')
#     tts.tts_with_vc_to_file(sentence, 
#                             file_path=sentence_temp_file, 
#                             # language="en", 
#                             speaker_wav='venkat.wav'
#                             )
#     chunk_audio = AudioSegment.from_wav(sentence_temp_file)
#     os.remove(sentence_temp_file)
#     return chunk_audio

# @permission_classes([IsAuthenticated])

# @api_view(['GET'])
# def PodCastGenerator2(request):
#     try:
#         voice_text = request.GET.get('voicePrompt')

#         if not voice_text:
#             return Response({"error": "Voice text is required"}, status=status.HTTP_400_BAD_REQUEST)
        
#         cache_key = hashlib.md5(voice_text.encode()).hexdigest()
#         cached_audio = cache.get(cache_key)

#         if cached_audio:
#             # Return cached audio if it exists
#             response = HttpResponse(cached_audio, content_type='audio/wav')
#             response['Content-Disposition'] = 'inline; filename="podcast.wav"'
#             return response

#         # temp_file_name = tempfile.mktemp(suffix='.ogg')
#         text_splitter = RecursiveCharacterTextSplitter(
#             # Set a really small chunk size, just to show.
#             chunk_size=200,
#             chunk_overlap=0,
#             length_function=len,
#             is_separator_regex=False,
#         )

#         sentences = text_splitter.split_text(voice_text)

#         combined_audio = AudioSegment.empty()
#         first_chunk_audio = process_chunk(sentences[0])
#         combined_audio += first_chunk_audio

#         with ThreadPoolExecutor() as executor:
#             chunk_audios = list(executor.map(process_chunk, sentences[1:]))
#             for chunk_audio in chunk_audios:
#                 combined_audio += chunk_audio

#         # Save the combined audio to a temporary file
#         temp_file_name = tempfile.mktemp(suffix='.wav')
#         combined_audio.export(temp_file_name, format="wav")

#         # Read the temporary file and send it back as a response
#         with open(temp_file_name, 'rb') as audio_file:
#             audio_content = audio_file.read()


#         # combined_audio = AudioSegment.empty()
#         # for sentence in sentences:
#         #     sentence_temp_file = tempfile.mktemp(suffix='.ogg')
#         #     tts.tts_with_vc_to_file(
#         #         sentence,
#         #         file_path=sentence_temp_file,

#         #         speaker_wav='nova.wav'
#         #     )
#         #     try:
#         #         chunk_audio = AudioSegment.from_wav(sentence_temp_file)
#         #         combined_audio += chunk_audio
#         #     except pydub_exceptions.PydubException as e:
#         #         return Response({"error": f"Pydub error when processing chunk: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#         #     finally:
#         #         os.remove(sentence_temp_file)

#         # # Save the generated audio to a temporary file
#         # # tts.tts_to_file(voice_text, file_path=temp_file_name)
#         # combined_audio.export(temp_file_name, format="wav")

#         # Read the temporary file and send it back as a response
#         # with open(temp_file_name, 'rb') as audio_file:
#         #     audio_content = audio_file.read()

#         os.remove(temp_file_name)
#         cache.set(cache_key, audio_content, timeout=300) # Cache the audio for 5 minutes

#         response = HttpResponse(audio_content, content_type='audio/mpeg')
#         response['Content-Disposition'] = 'inline; filename="podcast.mp3"'
#         return response

#     except Exception as e:
#         return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# model_id = "CompVis/stable-diffusion-v1-4"
# device = "cuda" if torch.cuda.is_available() else "cpu"

# pipeline = StableDiffusionPipeline.from_pretrained(model_id)
# pipeline.to(device)

# pipe = StableDiffusionPipeline.from_pretrained("CompVis/stable-diffusion-v1-4")

# @permission_classes([IsAuthenticated])
@api_view(['GET'])
def ImageGenerator(request):
    try:
        prompt = request.GET.get('prompt')
        if not prompt:
            return Response({"error": "Prompt is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Generate the image
        pipe.to(device)
        img = pipe(prompt).images[0]

        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format='PNG')
        img_byte_arr = img_byte_arr.getvalue()

        response = HttpResponse(img_byte_arr, content_type='image/png')
        response['Content-Disposition'] = 'inline; filename="generated_image.png"'
        return response

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)