from django.urls import path
from .views import *
from core.podcast.views import (
    PodCastCreate, 
    TrendingPodCastList, 
    GetSpecificPodCast, 
    GetSimilarPodCast,
    DeletePodcast,
    GetTopPodCasters,
    SearchPodcasts,
    UserPodcastsView,
)
from core.podcast.utils import process_image_view
from core.create_podcast_audio import CreatePodcastAudioTTS, GetAvailableLanguages

urlpatterns = [
    path('podcast/generate/', PodCastGenerator, name='core-podcast-generate'),
    path('podcast/generate2/', CreatePodcastAudioTTS.as_view(), name='core-podcast-generate2'),
    path('image/generate/', ImageGenerator, name='core-image-generate'),
    path('podcast/create/', PodCastCreate, name='core-podcast-create'),
    path('podcast/trending/', TrendingPodCastList.as_view(), name='core-podcast-trending'),
    path('process-image/<int:image_id>/image.png', process_image_view, name='core-process_image_view'),

    path('podcast/<uuid:podcast_uuid>/', GetSpecificPodCast.as_view(), name='core-get_specific_podcast'),
    path('podcast/<uuid:podcast_uuid>/similar/', GetSimilarPodCast.as_view(), name='core-get_similar_podcast'),
    path('podcast/<uuid:uuid>/delete/', DeletePodcast.as_view(), name='core-delete_podcast'),

    path('podcast/top-podcasters/', GetTopPodCasters.as_view(), name='core-get_top_podcasters'),
    path('podcast/search/', SearchPodcasts.as_view(), name='core-search_podcasts'),
    path('podcast/<int:user_id>/podcasts/', UserPodcastsView.as_view(), name='core-user_podcasts'),

    path('podcast/available-languages/', GetAvailableLanguages, name='core-get_available_languages'),
]
