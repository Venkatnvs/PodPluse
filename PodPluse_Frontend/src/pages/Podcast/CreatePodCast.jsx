import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Layout from "../Layouts/Layout";
import { z } from "zod"
import { Label } from "@radix-ui/react-label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { customVoice, voiceCategories } from "./data";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import PadcastAudio from "@/components/PadcastAudio";
import PodcastImage from "@/components/PodcastImage";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createPodcastApi, getPodcastAvailableLanguagesApi } from "@/apis/PodCast";
import { useNavigate } from "react-router-dom";
import { ReactMediaRecorder } from "react-media-recorder";
import { FaMicrophone, FaStop, FaRedo } from 'react-icons/fa';

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

  const [customAudio, setCustomAudio] = useState(null)
  const [customAudioBlob, setCustomAudioBlob] = useState(null)
  const [isRecording, setIsRecording] = useState(false);

  const [language, setLanguage] = useState(null)
  const [avaliabeLanguages, setAvailableLanguages] = useState([])
  const [recordingTime, setRecordingTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    async function fetchLanguages() {
      try {
        const response = await getPodcastAvailableLanguagesApi()
        setAvailableLanguages(response.data)
      } catch (error) {
        console.error('Error fetching languages:', error)
      }
    }
    fetchLanguages()
  }, [])

  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: '',
      podcastDescription: '',
    },
  })

  useEffect(() => {
    if (isRecording) {
      const id = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
      setIntervalId(id);
    } else {
      clearInterval(intervalId);
      setRecordingTime(0);
    }
  }, [isRecording]);

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
      formData.append('language', language)

      createPodcastApi(formData).then(() => {
        setIsLoading(false)
        toast({
          title: 'Success',
          description: 'Podcast created successfully'
        })
        navigate('/')
      }).catch((error) => {
        console.error('Error creating podcast:', error)
        setIsLoading(false)
        toast({
          title: 'Error',
          description: 'Error creating podcast',
          variant: 'destructive'
        })
      })
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
                  <FormMessage className="text-orange-1" />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2.5">
              <Label className="text-14 font-bold text-white-1">
                Select AI Voice
              </Label>

              <Select onValueChange={(value) => setVoiceType(value)}>
                <SelectTrigger className={cn('text-14 w-full border-none bg-black-1 text-gray-1 focus-visible:ring-offset-orange-1')}>
                  <SelectValue placeholder="Select AI Voice" className="placeholder:text-gray-1 " />
                </SelectTrigger>
                <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1 focus:ring-orange-1">
                  {voiceCategories.map((category) => (
                    <SelectItem key={category} value={category} className="capitalize focus:bg-orange-1">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>

                {voiceType === customVoice && (
                  <div className="flex flex-col gap-2.5 mt-3">
                    <Label 
                      className="text-14 font-bold text-white-1"
                    >
                      Record Your Voice (5-10 seconds)
                    </Label>
                    <ReactMediaRecorder
                      audio
                      onStop={(blobUrl, blob) => {
                        setCustomAudio(blobUrl);
                        setCustomAudioBlob(blob);
                        setIsRecording(false);
                      }}
                      render={({ startRecording, stopRecording }) => (
                        <div className="flex flex-col items-center gap-2">
                          <Button
                            className="text-14 w-full bg-orange-500 font-bold text-white transition-all duration-500 hover:bg-orange-600 rounded"
                            onClick={() => {
                              if (isRecording) {
                                stopRecording();
                                setIsRecording(false);
                              } else {
                                startRecording();
                                setIsRecording(true);
                              }
                            }}
                          >
                            {isRecording ? <FaStop /> : <FaMicrophone />}&nbsp;
                            {isRecording ? 'Stop Recording' : 'Record from Microphone'}
                          </Button>
                          {isRecording && (
                            <div className="text-white-1 mt-2">
                              Recording... {recordingTime}s
                            </div>
                          )}
                          {customAudio && (
                            <audio src={customAudio} controls className="mt-2 w-full rounded-md shadow-lg" />
                          )}
                        </div>
                      )}
                    />
                  </div>
                )}
                {(voiceType && voiceType !== customVoice) && (
                  <audio 
                    src={`/${voiceType}.mp3`}
                    autoPlay
                    className="hidden"
                  />
                )}
              </Select>
            </div>

            <div className="flex flex-col gap-2.5">
              <Label className="text-14 font-bold text-white-1">
                Select Language
              </Label>

              <Select onValueChange={(value) => setLanguage(value)}>
                <SelectTrigger className={cn('text-16 w-full border-none bg-black-1 text-gray-1 focus-visible:ring-offset-orange-1')}>
                  <SelectValue placeholder="Select Language" className="placeholder:text-gray-1 " />
                </SelectTrigger>
                <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1 focus:ring-orange-1">
                  {avaliabeLanguages.map((language) => (
                    <SelectItem key={language} value={language} className="capitalize focus:bg-orange-1">
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
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
                  <FormMessage className="text-orange-1" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col pt-10">
              <PadcastAudio
                setAudio={setAudioUrl}
                setAudioBlob={setAudioBlob}
                voiceType={voiceType || ""}
                language={language || ""}
                audio={audioUrl}
                voicePrompt={voicePrompt}
                setVoicePrompt={setVoicePrompt}
                setAudioDuration={setAudioDuration}
                customAudioBlob={customAudioBlob}
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