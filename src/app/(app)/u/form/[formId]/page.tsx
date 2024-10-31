'use client';

import { useEffect, useState, useCallback } from 'react';
import { getFormReviews } from '@/actions/formActions';
import { Message } from '@/model/Messages.model';
import ShareReviewLink from '@/components/custom/ShareReviewLink';
import Toggles from '@/components/custom/toggles';
import { Separator } from '@/components/ui/separator';
import { Loader2, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MessageCard from '@/components/custom/MessageCard';


export default function Page({ params: { formId } }: {params: { formId: string }}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [context, setContext] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchFormReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = JSON.parse(JSON.stringify(await getFormReviews(formId)));
      console.log(res)
      const { messages, context, name }=res;
      setMessages(messages || []);
      setContext(context || '');
      setName(name || '');
    } catch (error) {
      console.error('Failed to fetch form reviews:', error);
    } finally {
      setIsLoading(false);
    }
  }, [formId]);

  useEffect(() => {
    fetchFormReviews();
  }, [fetchFormReviews]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchFormReviews();
    }, 2 * 60 * 1000 );

    return () => clearInterval(interval);
  }, [fetchFormReviews]);

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white dark:bg-gray-800 rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Form name: <span className="font-normal">{name}</span>
      </h1>

      <h2 className="text-lg mb-2 text-gray-800 dark:text-gray-200">
        <span className="font-semibold">Context:</span> {context}
      </h2>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
          Copy Your Unique Link
        </h2>
        <ShareReviewLink formId={formId} />
      </div>

      <Separator className="mt-2 mb-3" />

      {/* Toggles */}
      <div className="">
        <Toggles formId={formId} />
      </div>

      <Button
        className="mt-4"
        variant="outline"
        onClick={fetchFormReviews}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

      <Separator className="mt-4" />

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length ? (
          messages?.map((message, index) => (
            <div key={index}>
              <MessageCard
                message={message}
                formId={formId}
                onDelete={fetchFormReviews}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No messages to display.</p>
        )}
      </div>
    </div>
  );
}
