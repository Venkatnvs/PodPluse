from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

class Podcast(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    author = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def likes(self):
        return self.reaction_set.filter(reaction='like').count()
    
    @property
    def dislikes(self):
        return self.reaction_set.filter(reaction='dislike').count()
    
    @property
    def reactions(self):
        return self.reaction_set.all()
    
    @property
    def audio(self):
        return self.audio_set.first()
    
    @property
    def viewed_users(self):
        podcast_views = PodcastView.objects.filter(podcast=self)
        viewed_user_ids = podcast_views.values_list('viewer', flat=True).distinct()
        viewed_users = User.objects.filter(id__in=viewed_user_ids)
        return viewed_users
    
    @property
    def image(self):
        return self.image_set.first() if self.image_set.exists() else "https://via.placeholder.com/150?text=No+Image&bg=000000&fg=ffffff"

    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-created_at']

class Reaction(models.Model):
    LIKE = 'like'
    DISLIKE = 'dislike'
    REACTION_CHOICES = [
        (LIKE, 'Like'),
        (DISLIKE, 'Dislike'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    podcast = models.ForeignKey(Podcast, on_delete=models.CASCADE)
    reaction = models.CharField(max_length=7, choices=REACTION_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'podcast', 'reaction')
        ordering = ['-created_at']

class PodcastView(models.Model):
    podcast = models.ForeignKey(Podcast, on_delete=models.CASCADE)
    viewer = models.ForeignKey(User, on_delete=models.CASCADE)
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['podcast', 'viewed_at']),
            models.Index(fields=['viewer', 'viewed_at']),
        ]

    def __str__(self):
        return f"Viewer: {self.viewer.email}, Podcast: {self.podcast.title}"

class Audio(models.Model):
    podcast = models.OneToOneField(Podcast, on_delete=models.CASCADE)
    title = models.CharField(max_length=100, null=True, blank=True)
    audio_file = models.FileField(upload_to='audio/')
    voice_prompt = models.CharField(max_length=100, null=True, blank=True)
    voice_type = models.CharField(max_length=100, null=True, blank=True)
    duration = models.CharField(max_length=100, null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-date']

class Image(models.Model):
    podcast = models.OneToOneField(Podcast, on_delete=models.CASCADE)
    title = models.CharField(max_length=100, null=True, blank=True, default='Image')
    image = models.ImageField(upload_to='images/')
    image_prompt = models.CharField(max_length=100, null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-date']