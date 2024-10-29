import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Calendar, Clock } from "lucide-react"
import { format } from "date-fns"
import { getAllForms } from "@/actions/forms"
import { Form } from "@/model/Forms.model"
import Link from "next/link"
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



const FormDisplay=async()=> {

  const forms=await getAllForms("Nikhilesh007");
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between px-2 py-3">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">Your Forms</h1>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms?.map((form:Form) => (
          <Link key={form._id} href={`/u/form/${form._id}`} >
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Form {form.name}
                  </CardTitle>
                  <Badge variant={form.isAcceptingMessages ? "success" : "destructive"}>
                    {form.isAcceptingMessages ? (
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Open
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        Closed
                      </span>
                    )}
                  </Badge>
                </div>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {form.context}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-2 text-gray-700 dark:text-gray-300">
                  <Calendar className="w-4 h-4 mr-2" />
                  Created: {format(new Date(form.createdAt), 'MMM d, yyyy')}
                </div>
                <div className="flex items-center mb-2 text-gray-700 dark:text-gray-300">
                  <Clock className="w-4 h-4 mr-2" />
                  Expires: {format(new Date(form.formExpiry), 'MMM d, yyyy')}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {form?.messages?.length} message(s)
                  </span>
                  {form.isSuggestingMessages && (
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      <Brain className="w-4 h-4 mr-1" />
                      AI Suggestions
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default FormDisplay;
