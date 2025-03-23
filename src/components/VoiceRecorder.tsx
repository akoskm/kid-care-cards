import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

interface VoiceRecorderProps {
  childId?: string;
  onSuccess?: () => void;
}

export function VoiceRecorder({ childId, onSuccess }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: 'Error',
        description: 'Could not access microphone. Please check your permissions.',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);

      // Get the current user's ID
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error('You must be logged in to use voice recording');
      }

      // Convert audio to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);

      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        const base64Data = base64Audio.split(',')[1];

        // Call the Edge Function
        const { data, error } = await supabase.functions.invoke('process-voice', {
          body: { audio: base64Data },
          headers: {
            'x-user-id': session.user.id,
          },
        });

        if (error) throw error;

        if (data && data.success) {
          toast({
            title: 'Success',
            description: 'Voice recording processed successfully!',
          });
          onSuccess?.();
        } else {
          throw new Error('Failed to process voice recording');
        }
      };
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: 'Error',
        description: 'Failed to process voice recording. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
        variant={isRecording ? "destructive" : "default"}
        size="icon"
        className="relative"
      >
        {isRecording ? (
          <>
            <Square className="h-4 w-4" />
            <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20" />
          </>
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>
      {isProcessing && (
        <div className="text-sm text-muted-foreground">
          Processing your recording...
        </div>
      )}
    </div>
  );
}