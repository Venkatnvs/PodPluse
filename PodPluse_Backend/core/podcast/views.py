from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from core.models import Podcast, Audio, Image
from core.podcast.serializers import (
    PodcastSerializer,
    AudioSerializer,
    ImageSerializer,
    FullPodcastSerializer,
    TopPodcasterSerializer,
    )
from account.serializers import UserSerializer
from rest_framework.generics import ListAPIView, DestroyAPIView
from django.db.models import Q, Count, Sum
from django.contrib.auth import get_user_model
from rest_framework.exceptions import NotFound

User = get_user_model()

@transaction.atomic
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def PodCastCreate(request):
    data = request.data
    image_file = request.FILES.get('image')
    audio_file = request.FILES.get('audio')
    user = request.user
    title = data.get('title')
    description = data.get('description')
    voiceType = data.get('voiceType')
    audioDuration = data.get('audioDuration')
    voicePrompt = data.get('voicePrompt')
    podcast = Podcast.objects.create(
        user=user,
        title=title,
        description=description,
        author=user.full_name
    )
    podcast.save()
    audio = Audio.objects.create(
        podcast=podcast,
        title=title,
        audio_file=audio_file,
        voice_prompt=voicePrompt,
        voice_type=voiceType,
        duration=audioDuration
    )
    audio.save()
    image = Image.objects.create(
        podcast=podcast,
        title=title,
        image=image_file,
        image_prompt="Uploaded"
    )
    image.save()
    return Response({"message": "Podcast saved successfully"}, status=status.HTTP_200_OK)

class TrendingPodCastList(ListAPIView):
    serializer_class = PodcastSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user:
            return None
        return Podcast.objects.all()
    
class GetSpecificPodCast(ListAPIView):
    serializer_class = FullPodcastSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user:
            return None
        podcast_uuid = self.kwargs.get('podcast_uuid')
        return Podcast.objects.filter(uuid=podcast_uuid)
    
class GetSimilarPodCast(ListAPIView):
    serializer_class = PodcastSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        podcast_uuid = self.kwargs['podcast_uuid']
        current_podcast = Podcast.objects.get(uuid=podcast_uuid)
        similar_podcasts = Podcast.objects.filter(
            Q(author=current_podcast.author) |
            Q(title__icontains=current_podcast.title)
        ).exclude(uuid=podcast_uuid)
        return similar_podcasts


class DeletePodcast(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Podcast.objects.all()
    lookup_field = 'uuid'
    
    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class GetTopPodCasters(ListAPIView):
    serializer_class = TopPodcasterSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        top_podcasters = User.objects.annotate(
            podcast_count=Count('podcast'),
            total_likes=Sum('podcast__reaction__reaction')
        ).filter(podcast_count__gt=0).order_by('-podcast_count', '-total_likes')
        return top_podcasters
    
class SearchPodcasts(ListAPIView):
    serializer_class = PodcastSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Podcast.objects.all()
        query = self.request.query_params.get('q', None)
        
        if query:
            queryset = queryset.filter(
                Q(title__icontains=query) |
                Q(description__startswith=query) |
                Q(author__icontains=query)
            )
        
        return queryset
    
class UserPodcastsView(ListAPIView):
    serializer_class = PodcastSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        if not User.objects.filter(id=user_id).exists():
            raise NotFound('User not found.')
        return Podcast.objects.filter(user_id=user_id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        user_id = self.kwargs.get('user_id')
        user = User.objects.get(id=user_id)

        user_serializer = UserSerializer(user, context={'request': request})
        podcast_serializer = PodcastSerializer(queryset, context={'request': request}, many=True)

        return Response({
            'user': user_serializer.data,
            'podcasts': podcast_serializer.data
        })