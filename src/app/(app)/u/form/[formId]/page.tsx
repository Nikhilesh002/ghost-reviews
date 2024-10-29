import { getFormReviews } from '@/actions/formActions';
import {Message} from "@/model/Messages.model"
import MessagesList from '@/components/custom/MessagesList';
import ShareReviewLink from '@/components/custom/ShareReviewLink';
import Toggles from '@/components/custom/toggles';
import { Separator } from '@/components/ui/separator';


async function page({params:{formId}}:{params:{formId:string}}) {

  const messages= JSON.parse(JSON.stringify(await getFormReviews(formId))) as Message[];


  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white dark:bg-gray-800 rounded w-full max-w-6xl">

      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Copy Your Unique Link</h2>
        <ShareReviewLink formId={formId} />
      </div>

      <Separator className='mt-2 mb-3' />

      {/* toggles */}
      <div className="">
        <Toggles formId={formId}/>
      </div>

      <Separator className='mt-4' />

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages?.length ? (
          <MessagesList formId={formId} messages={messages} />
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default page;
