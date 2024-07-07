import React, { useState } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { generatePodcastApi } from "@/apis/PodCast";

const useGereratePodcast = ({
  setAudio,
  voiceType,
  language,
  audio,
  setAudioBlob,
  voicePrompt,
  setVoicePrompt,
  setAudioDuration,
  toast,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const generatePodcast = async () => {
    setIsGenerating(true);
    setAudio(null);

    if (!voicePrompt) {
      setIsGenerating(false);
      toast({
        title: "Error",
        description: "Please provide text to generate audio",
        variant: "destructive",
      });
      return;
    }

    if (!voiceType) {
      setIsGenerating(false);
      toast({
        title: "Error",
        description: "Please select a voice type",
        variant: "destructive",
      });
      return;
    }

    if (!language) {
      setIsGenerating(false);
      toast({
        title: "Error",
        description: "Please select a language",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await generatePodcastApi({
        voicePrompt: voicePrompt,
        voiceType: voiceType,
        language: language,
      });
      const audioBlob = new Blob([res.data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      toast({
        title: "Success",
        description: "Audio generated successfully",
      });
      setAudio(audioUrl);
      setAudioBlob(audioBlob);
    } catch (error) {
      console.error('Error fetching audio:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error generating audio",
      });
    }
    setIsGenerating(false);
  };

  return { isGenerating, generatePodcast };
};

const PadcastAudio = ({
  setAudio,
  voiceType,
  language,
  audio,
  setAudioBlob,
  voicePrompt,
  setVoicePrompt,
  setAudioDuration,
}) => {

  const { toast } = useToast()

  const { isGenerating, generatePodcast } = useGereratePodcast({
    setAudio,
    voiceType,
    language,
    audio,
    setAudioBlob,
    voicePrompt,
    setVoicePrompt,
    setAudioDuration,
    toast,
  });

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
          AI Prompt to generate Podcast
        </Label>
        <Textarea
          className="input-class font-light border-0 focus-visible:ring-offset-orange-1"
          placeholder="Provide text to generate audio"
          rows={5}
          value={voicePrompt || ""}
          onChange={(e) => setVoicePrompt(e.target.value)}
        />
      </div>
      <div className="mt-5 w-full max-w-[200px]">
        <Button
          className="text-16 bg-orange-1 py-4 font-bold text-white-1 hover:bg-orange-800"
          onClick={generatePodcast}
          type="button"
        >
          {isGenerating ? (
            <>
              Generating
              <Loader size={20} className="animate-spin ml-2" />
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>
      {audio && (
        <audio
          controls
          src={audio}
          autoPlay
          className="mt-5"
          onLoadedMetadata={(e) => setAudioDuration(e.currentTarget.duration)}
        />
      )}
    </div>
  );
};

export default PadcastAudio;
