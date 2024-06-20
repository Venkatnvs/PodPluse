from django.contrib import admin
from .models import Podcast, Audio, Image, Reaction, PodcastView

admin.site.register(Podcast)
admin.site.register(Audio)
admin.site.register(Image)
admin.site.register(Reaction)
admin.site.register(PodcastView)