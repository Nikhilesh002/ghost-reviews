"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import CreateForm from "@/components/custom/create-form"

function CreateFormDialog({ username }: { username: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleFormCreationSuccess = () => {
    setIsDialogOpen(false) // Close the dialog on successful form creation
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsDialogOpen(true)}>Create new form</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create form</DialogTitle>
          <CreateForm username={username} onSuccess={handleFormCreationSuccess} />
          <DialogDescription />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default CreateFormDialog
