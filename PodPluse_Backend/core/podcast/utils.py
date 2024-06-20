from io import BytesIO
from PIL import Image as PILImage
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from core.models import Image
from PIL import ImageDraw, ImageFont

def process_image_view(request, image_id):
    # Get parameters from the request
    width = int(request.GET.get('width', 512))
    height = int(request.GET.get('height', 512))
    quality = int(request.GET.get('quality', 85))
    aspect_ratio = request.GET.get('aspect_ratio', 'keep')
    color = request.GET.get('color', None)
    high_quality = request.GET.get('high_quality', 'true').lower() == 'true'
    watermark = request.GET.get('watermark', None)
    font_type = request.GET.get('font_type', 'arial.ttf')
    watermark_x = int(request.GET.get('watermark_x', 0))
    watermark_y = int(request.GET.get('watermark_y', 0))
    font_size = int(request.GET.get('font_size', 20))

    image_obj = get_object_or_404(Image, id=image_id)
    image = PILImage.open(image_obj.image.path)

    # Resize image with or without keeping aspect ratio
    if aspect_ratio == 'keep':
        image.thumbnail((width, height), PILImage.Resampling.LANCZOS)
    else:
        image = image.resize((width, height), PILImage.Resampling.LANCZOS)

    # Convert to different color mode if specified
    if color:
        image = image.convert(color)

    # Apply watermark if specified
    if watermark:
        draw = ImageDraw.Draw(image)
        try:
            font = ImageFont.truetype(font_type, font_size)
        except IOError:
            font = ImageFont.load_default()
        draw.text((watermark_x, watermark_y), watermark, font=font)

    buffer = BytesIO()
    if high_quality:
        image.save(buffer, format='png', quality=quality, optimize=True)
    else:
        image.save(buffer, format='png', quality=quality)
    
    return HttpResponse(buffer.getvalue(), content_type='image/png')