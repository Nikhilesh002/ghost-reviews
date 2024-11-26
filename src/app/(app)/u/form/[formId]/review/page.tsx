import { getFormInfo, getFormAcceptStatus, getFormAIStatus } from '@/actions/formActions';
import ReviewForm from '@/components/custom/review-form';

const Page = async ({ params: { formId } }: { params: { formId: string } }) => {
  const { data } = await getFormInfo(formId);
  const acceptStatus = await getFormAcceptStatus(formId);
  const AIStatus= await getFormAIStatus(formId);

  if(!data){
    return (
      <div>
        <h1 className="text-3xl text-center font-medium mt-5 mb-3">
          Form not found
        </h1>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl text-center font-medium mt-5 mb-3">
        Welcome to {data?.name}&apos;s page
      </h1>
      <ReviewForm 
        formId={formId} 
        reviewForm={data} 
        isAcceptingMessages={acceptStatus.isAcceptingMessages || false}
        isSuggestingMessages={AIStatus.isSuggestingMessages || false}
      />
    </div>
  );
};

export default Page;
