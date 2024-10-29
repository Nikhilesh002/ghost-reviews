"use client"

// export const makeFormUrl=(formId:string)=>{
//   const formUrl = `${window.location.host}/u/form/${formId}/review`;
// }



function MakeFormUrl(formId:string) {
  return (
    <p>{`${window.location.host}/u/form/${formId}/review`}</p>
  )
}

export default MakeFormUrl;
