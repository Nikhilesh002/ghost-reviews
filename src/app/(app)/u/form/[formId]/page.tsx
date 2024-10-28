import { getFormReviews } from "@/actions/forms";


async function page({params}:{params:{formId:string}}) {
  console.log(params.formId)
  const msgs= await getFormReviews(params.formId);
  console.log(msgs)

  return (
    <div>page</div>
  )
}

export default page;
