import React, { useRef, useState } from 'react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Image, Loader } from 'lucide-react'
import { useToast } from './ui/use-toast'
import { Input } from './ui/input'

const PodcastImage = (
  {
    setImage,
    image,
    setImageBlob,
    imagePrompt,
    setImagePrompt,
  }
) => {
  const { toast } = useToast()
  const [isAiThumbnail, setIsAiThumbnail] = useState(true)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const imageRef = useRef(null)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      setImage(e.target.result)
    }
    reader.readAsDataURL(file)
    setImageBlob(file)
  }

  const generateImage = async () => {
    setIsImageLoading(true)
    setImage(null)
    if (!imagePrompt) {
      setIsImageLoading(false)
      toast({
        title: 'Error',
        description: 'Please provide text to generate image',
        variant: 'destructive'
      })
      return
    }

    try {
      // Call API to generate image
    } catch (error) {
      console.error('Error fetching image:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Error generating image'
      })
    }
    setIsImageLoading(false)
  }

  const uploadImage = async (e) => {
    setIsImageLoading(true)
    handleImageUpload(e)
    setIsImageLoading(false)
  }

  return (
    <div>
      <div className="generate_thumbnail w-full">
        <Button
          type="button"
          variant="plain"
          onClick={() => {setIsAiThumbnail(true);setImage(null)}}
          className={cn('', {
            'bg-black-6': isAiThumbnail
          })}
        >
          Use AI to generate thumbnail
        </Button>
        <Button
          type="button"
          variant="plain"
          onClick={() => {setIsAiThumbnail(false);setImage(null)}} 
          className={cn('', {
            'bg-black-6': !isAiThumbnail
          })}
        >
          Upload custom image
        </Button>
      </div>
      {
        isAiThumbnail ? (
          <div className="flex flex-col gap-5">
            <div className="mt-5 flex flex-col gap-2.5">
              <Label className="text-16 font-bold text-white-1">
                AI Prompt to generate Thumbnail
              </Label>
              <Textarea 
                className="input-class font-light focus-visible:ring-offset-orange-1"
                placeholder='Provide text to generate thumbnail'
                rows={5}
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
              />
            </div>
            <div className="w-full max-w-[200px]">
            <Button className="text-16 bg-orange-1 py-4 font-bold text-white-1" onClick={generateImage}>
              {isImageLoading ? (
                <>
                  Generating
                  <Loader size={20} className="animate-spin ml-2" />
                </>
              ) : (
                'Generate'
              )}
            </Button>
            </div>
          </div>
        ) : (
          <div className="image_div" onClick={() => imageRef?.current?.click()}>
          <Input
            type="file"
            className="hidden"
            ref={imageRef}
            onChange={(e) => uploadImage(e)}
          />
          {!isImageLoading ? (
            <Image src="/icons/upload-image.svg" width={40} height={40} alt="upload" />
          ): (
            <div className="text-16 flex-center font-medium text-white-1">
              Uploading
              <Loader size={20} className="animate-spin ml-2" />
            </div>
          )}
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-12 font-bold text-orange-1">
            Click to upload
            </h2>
            <p className="text-12 font-normal text-gray-1">SVG, PNG, JPG, or GIF (max. 1080x1080px)</p> 
          </div>
        </div>
        )
      }
      {image && (
        <div className="flex-center w-full">
          <img
            src={image}
            width={200}
            height={200}
            className="mt-5"
            alt="thumbnail"
          />
        </div>
      )}
    </div>
  )
}

export default PodcastImage