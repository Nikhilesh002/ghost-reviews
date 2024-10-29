import { getFormReviews } from '@/actions/forms';
import MessageCard from '@/components/custom/MessageCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {Message} from "@/model/Messages.model"
import MessagesList from '@/components/custom/MessagesList';


async function page({params:{formId}}:{params:{formId:string}}) {

  let messages:Message[];

  try {
    // Ensure JSON-compatible data structure by stripping non-serializable properties
    messages = JSON.parse(JSON.stringify(await getFormReviews(formId))) as Message[];
  } catch (error) {
    console.error("Error processing messages:", error);
    messages = [];
  }


  const formUrl = "qwertyuiop"


  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white dark:bg-gray-800 rounded w-full max-w-6xl">

      <div className="flex justify-between px-2 py-3">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">User Dashboard</h1>
        <Link href="/u/create-form">
          <Button>Create new form</Button>
        </Link>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <div className="bg-gray-50 dark:bg-gray-700 text-blue-500 dark:text-blue-400 underline rounded w-full p-2 mr-2">
            <Link href={formUrl} className="hover:text-blue-600 dark:hover:text-blue-300">{formUrl}</Link>
          </div>
          {/* <Button onClick={copyToClipboard}>Copy</Button> */}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages?.length ? (
          <MessagesList messages={messages} />
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default page;
