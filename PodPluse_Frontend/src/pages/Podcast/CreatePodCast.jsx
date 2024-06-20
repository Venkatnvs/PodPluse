import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Layout from "../Layouts/Layout";
import { z } from "zod"
import { Label } from "@radix-ui/react-label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { voiceCategories } from "./data";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input";
import { useState } from "react";
import PadcastAudio from "@/components/PadcastAudio";
import PodcastImage from "@/components/PodcastImage";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createPodcastApi } from "@/apis/PodCast";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  podcastTitle: z.string().min(2),
  podcastDescription: z.string().min(2),
})

const CreatePodCast = () => {
  const navigate = useNavigate()
  const [voiceType, setVoiceType] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioDuration, setAudioDuration] = useState(null)
  const [voicePrompt, setVoicePrompt] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [imageBlob, setImageBlob] = useState(null)
  const [imagePrompt, setImagePrompt] = useState(null)

  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: '',
      podcastDescription: '',
    },
  })

  function onSubmit(data) {
    setIsLoading(true)
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.mp3')
      formData.append('image', imageBlob, 'image.png')
      formData.append('title', data.podcastTitle)
      formData.append('description', data.podcastDescription)
      formData.append('voiceType', voiceType)
      formData.append('audioDuration', audioDuration)
      formData.append('voicePrompt', voicePrompt)
      formData.append('imagePrompt', imagePrompt)
      formData.append('imageUrl', imageUrl)

      createPodcastApi(formData)
      setIsLoading(false)
      toast({
        title: 'Success',
        description: 'Podcast created successfully'
      })
      navigate('/')
    } catch (error) {
      console.error('Error creating podcast:', error)
      setIsLoading(false)
      toast({
        title: 'Error',
        description: 'Error creating podcast',
        variant: 'destructive'
      })
    }
  }
  return (
    <Layout>
      <section className='mt-9 flex flex-col gap-5'>
        <h1 className="text-20 font-bold text-white-1">Create Podcast</h1>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 flex w-full flex-col">
          <div className="flex flex-col gap-[30px] border-b border-black-5 pb-10">
            <FormField
              control={form.control}
              name="podcastTitle"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">Title</FormLabel>
                  <FormControl>
                    <Input className="input-class focus-visible:ring-offset-orange-1" placeholder="JSM Pro Podcast" {...field} />
                  </FormControl>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2.5">
              <Label className="text-16 font-bold text-white-1">
                Select AI Voice
              </Label>

              <Select onValueChange={(value) => setVoiceType(value)}>
                <SelectTrigger className={cn('text-16 w-full border-none bg-black-1 text-gray-1 focus-visible:ring-offset-orange-1')}>
                  <SelectValue placeholder="Select AI Voice" className="placeholder:text-gray-1 " />
                </SelectTrigger>
                <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1 focus:ring-orange-1">
                  {voiceCategories.map((category) => (
                    <SelectItem key={category} value={category} className="capitalize focus:bg-orange-1">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
                {voiceType && (
                  <audio 
                    src={`/${voiceType}.mp3`}
                    autoPlay
                    className="hidden"
                  />
                )}
              </Select>
            </div>

            <FormField
              control={form.control}
              name="podcastDescription"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">Description</FormLabel>
                  <FormControl>
                    <Textarea className="input-class focus-visible:ring-offset-orange-1" placeholder="Write a short podcast description" {...field} />
                  </FormControl>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col pt-10">
              <PadcastAudio
                setAudio={setAudioUrl}
                setAudioBlob={setAudioBlob}
                voiceType={voiceType && voiceType}
                audio={audioUrl}
                voicePrompt={voicePrompt}
                setVoicePrompt={setVoicePrompt}
                setAudioDuration={setAudioDuration}
              />

              <PodcastImage 
                setImage={setImageUrl}
                setImageBlob={setImageBlob}
                image={imageUrl}
                imagePrompt={imagePrompt}
                setImagePrompt={setImagePrompt}
              />

              <div className="mt-10 w-full">
                <Button type="submit" className="text-16 w-full bg-orange-1 py-4 font-bold text-white-1 transition-all duration-500 hover:bg-orange-800 rounded">
                  {isLoading ? (
                    <>
                      Submitting
                      <Loader size={20} className="animate-spin ml-2" />
                    </>
                  ) : (
                    'Submit & Publish Podcast'
                  )}
                </Button>
              </div>
          </div>
        </form>
      </Form>
      </section>
    </Layout>
  )
}

export default CreatePodCast;