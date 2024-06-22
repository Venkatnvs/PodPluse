from rest_framework import serializers
from core.models import Podcast, Audio, Image, Reaction, PodcastView
from django.contrib.auth import get_user_model
from account.serializers import UserSerializer

User = get_user_model()

class PodcastSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()
    class Meta:
        model = Podcast
        fields = '__all__'

    def get_image(self, obj):
        image = obj.image
        if isinstance(image, Image):
            return ImageSerializer(image, context=self.context).data
        return image
    
    def get_user(self, obj):
        user = obj.user
        if isinstance(user, User):
            return UserSerializer(user, context=self.context).data
        return user

class AudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Audio
        fields = '__all__'

class ImageSerializer(serializers.ModelSerializer):
    full_image_url = serializers.SerializerMethodField()
    processed_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Image
        fields = '__all__'
    
    def get_full_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None
    
    def get_processed_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(f'/api/core/process-image/{obj.id}/image.png?width=512&height=512&quality=85&aspect_ratio=keep&color=RGB&background_color=white&high_quality=true&watermark=podpluse&font_type=arial.ttf&watermark_x=10&watermark_y=10&font_size=20')
        return None

class ReactionSerializer(serializers.ModelSerializer):
    length = serializers.SerializerMethodField()

    class Meta:
        model = Reaction
        fields = '__all__'

    def get_length(self, obj):
        return len(obj.reaction)

class PodcastViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = PodcastView
        fields = '__all__'

class FullPodcastSerializer(serializers.ModelSerializer):
    audio = AudioSerializer()
    image = ImageSerializer()
    reactions = ReactionSerializer(many=True)
    class Meta:
        model = Podcast
        fields = '__all__'

class TopPodcasterSerializer(serializers.ModelSerializer):
    podcasts = PodcastSerializer(many=True, read_only=True, source='podcast_set')
    podcast_count = serializers.IntegerField(read_only=True)
    total_likes = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'podcast_count', 'total_likes', 'podcasts']