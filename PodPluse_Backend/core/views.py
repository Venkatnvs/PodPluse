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
from pydub import AudioSegment
import nltk
from diffusers import StableDiffusionPipeline
import torch
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated

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
# tts = TTS(model_name="tts_models/de/thorsten/tacotron2-DDC", progress_bar=True)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def PodCastGenerator2(request):
    try:
        voice_text = request.GET.get('voicePrompt')

        if not voice_text:
            return Response({"error": "Voice text is required"}, status=status.HTTP_400_BAD_REQUEST)

        temp_file_name = tempfile.mktemp(suffix='.wav')
        sentences = nltk.sent_tokenize(voice_text)

        combined_audio = AudioSegment.empty()
        for sentence in sentences:
            sentence_temp_file = tempfile.mktemp(suffix='.wav')
            tts.tts_to_file(sentence, file_path=sentence_temp_file)
            sentence_audio = AudioSegment.from_wav(sentence_temp_file)
            combined_audio += sentence_audio
            os.remove(sentence_temp_file)

        # Save the generated audio to a temporary file
        # tts.tts_to_file(voice_text, file_path=temp_file_name)
        combined_audio.export(temp_file_name, format=".wav")

        # Read the temporary file and send it back as a response
        with open(temp_file_name, 'rb') as audio_file:
            audio_content = audio_file.read()

        os.remove(temp_file_name)

        response = HttpResponse(audio_content, content_type='audio/mpeg')
        response['Content-Disposition'] = 'inline; filename="podcast.mp3"'
        return response

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# model_id = "CompVis/stable-diffusion-v1-4"
device = "cuda" if torch.cuda.is_available() else "cpu"

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