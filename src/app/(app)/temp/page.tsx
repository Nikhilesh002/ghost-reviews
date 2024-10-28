import { getAllForms, getUserFormReviews } from '@/actions/forms';
import React from 'react'

async function page() {

  const data1= await getAllForms("Nikhilesh007");
  console.log(data1)
  // const data2= await getUserFormReviews("Nikhilesh007","123");
  // console.log(data2)

  return (
    <div>temp page</div>
  )
}

export default page;
