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


function CreateFormDialog() {
  return (
    <Dialog>
          <DialogTrigger>
            <Button>Create new form</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create form</DialogTitle>
                <CreateForm/>
              <DialogDescription>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
  )
}

export default CreateFormDialog;
