import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { AudioLines } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useSubscription } from '@/context/SubscriptionContext';

interface VoiceRecorderProps {
  onSuccess?: () => void;
}

export function VoiceRecorder({ onSuccess }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const { toast } = useToast();
  const { isSubscribed, isTrialing, dictationUsage, dictationUsageLimit, incrementDictationUsage } = useSubscription();

  const startRecording = async () => {
    if (!isSubscribed && !isTrialing) {
      setShowSubscriptionDialog(true);
      return;
    }

    // Check usage limit for non-subscribed users
    if (!isSubscribed && dictationUsage >= dictationUsageLimit) {
      setShowSubscriptionDialog(true);
      return;
    }

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
      const base64Audio = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          const base64Data = base64Audio.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });

      // Call the Edge Function
      const { data, error } = await supabase.functions.invoke('process-voice', {
        body: { audio: base64Audio },
        headers: {
          'x-user-id': session.user.id,
        },
      });

      if (error) {
        setShowSubscriptionDialog(true);
      }

      if (data?.success) {
        // Update usage count if not subscribed
        if (!isSubscribed) {
          await incrementDictationUsage();
        }

        toast({
          title: 'Success',
          description: 'Voice recording processed successfully!',
        });
        onSuccess?.();
      } else {
        throw new Error('Failed to process voice recording');
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process voice recording. Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
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
      </div>
      <Dialog open={isProcessing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AudioLines className="h-5 w-5 animate-pulse" />
              Processing Recording
            </DialogTitle>
            <DialogDescription>
              Please wait while we process your voice recording. This may take a few moments.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showSubscriptionDialog} onOpenChange={setShowSubscriptionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subscription Required</DialogTitle>
            <DialogDescription>
              The dictation feature requires a subscription. Subscribe now to unlock unlimited dictation.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubscriptionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => window.location.href = '/settings'}>
              View Plans
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}