'use client';

import { Switch } from '../ui/switch';
import { useEffect, useState, useCallback } from 'react';
import { getFormAcceptStatus, getFormAIStatus, toggleFormAcceptStatus, toggleFormAIStatus } from '@/actions/formActions';
import { toast } from '../ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';

function Toggles({ formId }: { formId: string }) {
  const [isAcceptSwitchLoading, setIsAcceptSwitchLoading] = useState(true);
  const [isSuggestSwitchLoading, setIsSuggestSwitchLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
    defaultValues: {
      acceptMessages: false,
      suggestMessages: false,
    },
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch('acceptMessages');
  const suggestMessages = watch('suggestMessages');

  // fetch initial states
  useEffect(() => {
    const fetchInitialStatus = async () => {
      setIsAcceptSwitchLoading(true);
      setIsSuggestSwitchLoading(true);

      try {
        const acceptStatus = await getFormAcceptStatus(formId);
        const suggestStatus = await getFormAIStatus(formId);

        setValue('acceptMessages', acceptStatus.isAcceptingMessages ?? false);
        setValue('suggestMessages', suggestStatus.isSuggestingMessages ?? false);
      } catch (error) {
        console.error('Failed to fetch initial toggle statuses', error);
      } finally {
        setIsAcceptSwitchLoading(false);
        setIsSuggestSwitchLoading(false);
      }
    };

    fetchInitialStatus();
  }, [formId, setValue]);

  // handleFormAcceptSwitchChange
  const handleFormAcceptSwitchChange = useCallback(async () => {
    setIsAcceptSwitchLoading(true);
    try {
      if (acceptMessages && suggestMessages) {
        await handleFormAISwitchChange();
      }

      const res = await toggleFormAcceptStatus(formId);
      if (res.success) {
        setValue('acceptMessages', !acceptMessages);

        if (!acceptMessages && suggestMessages) {
          await handleFormAISwitchChange();
          setValue('suggestMessages', false);
        }

        toast({ title: res.message });
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      console.error('Failed to toggle accept messages status', error);
      toast({
        title: "Error toggling accept messages status",
        variant: "destructive",
      });
    } finally {
      setIsAcceptSwitchLoading(false);
    }
  }, [formId, acceptMessages, suggestMessages, setValue]);

  // handleFormAISwitchChange
  const handleFormAISwitchChange = useCallback(async () => {
    if (!acceptMessages) return;

    setIsSuggestSwitchLoading(true);
    try {
      const res = await toggleFormAIStatus(formId);
      if (res.success) {
        setValue('suggestMessages', !suggestMessages);
        toast({ title: res.message });
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      console.error('Failed to toggle AI suggestions status', error);
      toast({
        title: "Error toggling AI suggestions status",
        variant: "destructive",
      });
    } finally {
      setIsSuggestSwitchLoading(false);
    }
  }, [formId, acceptMessages, suggestMessages, setValue]);


  return (
    <div className="flex flex-wrap gap-14">
      <div>
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleFormAcceptSwitchChange}
          disabled={isAcceptSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>

      <div>
        <Switch
          {...register('suggestMessages')}
          checked={suggestMessages}
          onCheckedChange={handleFormAISwitchChange}
          disabled={isSuggestSwitchLoading || !acceptMessages} // disable if accepting messages is off
        />
        <span className="ml-2">
          AI Suggestions: {suggestMessages ? 'On' : 'Off'}
        </span>
      </div>
    </div>
  );
}

export default Toggles;
