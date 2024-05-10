
"use client"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { eventFormSchema } from "@/lib/validator"
import { eventDefaultValues } from "@/constants"
import  Dropdown from "@/components/shared/Dropdown"
import { Textarea } from "@/components/ui/textarea"
import FileUploader from "./FileUploader"
import Image from "next/image"
import {useUploadThing} from "@/lib/uploadthing"
import { useRouter } from "next/navigation"
import { createEvent, updateEvent } from "@/lib/actions/event.action"
import { IEvent } from "@/lib/database/model/event.model"
import { convertImage } from "@/lib/actions/imageconvert.action"


type EventFormProps = {
  userId:string ,
  type:"Create" | "Update",
  event?:IEvent,
  eventId?:string
}


const EventForm = ({userId,type,event,eventId}:EventFormProps) => {

  const [files,setFiles] = useState<File[]>([]);
 

 

  const initialState= event && type==='Update' ? {
    ...event,
    startDateTime: new Date(event.startDateTime), 
    endDateTime: new Date(event.endDateTime) ,
    categoryId:event?.category?._id,
  } : eventDefaultValues;

  const router= useRouter();

  const {startUpload} = useUploadThing('imageUploader'); 

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialState
  })



 

  async function onSubmit(data: z.infer<typeof eventFormSchema>) {
    let event = {...data};
    if(files.length > 0) {
      const data = new FormData();
      data.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_UPLOAD_PRESET_NAME ?? ""
      );
      data.append("cloud_name", process.env.NEXT_PUBLIC_CLOUD_NAME ?? "");
    data.append("file", files[0]);
    data.append("folder", "event-image");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const res = await response.json(); // Parse JSON response
    const secureUrl = res["secure_url"]; 
    
      event={...event,imageUrl:secureUrl}

    } catch (error) {
      console.log(error,"See the error too")
     toast.error("Failed to upload image")
    }
 
    }

  


  if(type==="Create") {    
    try {
      const newEvent = await createEvent({
        event:event,
        userId,
        path:"/profile" 
        //where to redirect user after creating event
      });


      if(newEvent) {
        toast.success("New Event has Been created")
        form.reset();
        router.push(`/events/${newEvent._id}`)
      }

    }

    
    catch (error:unknown) {
    
        console.log(error,"see error while creating event")
        toast.error("Failed to Create Event")
    }
  }

  if(type === 'Update') {
    if(!eventId) {
      router.back()
      return;
    }

    try {
      const updatedEvent = await updateEvent({
        userId,
        event: { ...event, _id: eventId },
        path: `/events/${eventId}`
      })

      if(updatedEvent) {
        form.reset();
        toast.success(" Event has Been Successfully Updated")
        router.push(`/events/${updatedEvent._id}`)
      }
    } catch (error:unknown) {
      console.log(error,"See error type");
      toast.error("Failed to update Event")
    }
  }

  }

  return (
    <Form {...form}>
      <form  
      onSubmit={form.handleSubmit(onSubmit)} 
      className="flex flex-col gap-5"
      >

        <div className=" flex flex-col gap-5 md:flex-row">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className=" w-full">
            
              <FormControl>
                <Input  className="input-field" placeholder="Event Title" {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />


         <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Dropdown
                onChangeHandler={field.onChange}
                value={field.value}
                 />
              </FormControl> 
              <FormMessage />
            </FormItem>
          )}
        />
        </div>

      <div className="flex flex-col gap-5 md:flex-row">
      <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormControl className="h-72">
                <Textarea className="textarea rounded-2xl" placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

          <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormControl className="h-72 ">
              <FileUploader
              onFieldChange={field.onChange}
              imageUrl={field.value}
              setFiles={setFiles}
              />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />



      </div>

      <div className="flex flex-col gap-5 md:flex-row ">
      <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className=" w-full">
            
              <FormControl>
                <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                  <Image 
                  src="/assets/icons/location-grey.svg"
                  alt="calendar"
                  width={24}
                  height={24}
                  />
                <Input  className="input-field" placeholder="Event Location or Online" {...field} />
                </div>
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex flex-col gap-5 md:flex-row ">
      <FormField
          control={form.control}
          name="startDateTime"
          render={({ field }) => (
            <FormItem className=" w-full">
            
              <FormControl>
                <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                  <Image 
                  src="/assets/icons/calendar.svg"
                  alt="calendar"
                  width={24}
                  height={24}
                  className="filter-grey"
                  />
                  <p className="ml-3 whitespace-nowrap text-grey-600">Start Date:</p>
                  <DatePicker 
                   timeInputLabel="Time:"
                   dateFormat="MM/dd/yyyy h:mm a"
                  selected={field.value}
                   onChange={(date:Date) => field.onChange(date)} 
                   showTimeSelect
                   wrapperClassName="datePicker"
                   />
                </div>
              </FormControl> 
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="endDateTime"
          render={({ field }) => (
            <FormItem className=" w-full">
            
              <FormControl>
                <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                  <Image 
                  src="/assets/icons/calendar.svg"
                  alt="calendar"
                  width={24}
                  height={24}
                  className="filter-grey"
                  />
                  <p className="ml-3 whitespace-nowrap text-grey-600">End Date:</p>
                  <DatePicker 
                   timeInputLabel="Time:"
                   dateFormat="MM/dd/yyyy h:mm a"
                  selected={field.value}
                   onChange={(date:Date) => field.onChange(date)} 
                   showTimeSelect
                   wrapperClassName="datePicker"
                   />
                </div>
              </FormControl> 
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

     
      <div className="flex flex-col gap-5 md:flex-row ">

      <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem className=" w-full">
            
              <FormControl>
                <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                  <Image 
                  src="/assets/icons/dollar.svg"
                  alt="dollar"
                  width={24}
                  height={24}
                  className="filter-grey"
                  />
                    <Input  
                    type="number"
                     className="p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 " 
                     placeholder="Price"
                      {...field} />

                       <FormField
                        control={form.control}
                        name="isFree"
                        render={({ field }) => (
                          <FormItem>
                          
                            <FormControl>
                              <div className="flex items-center">
                            <label 
                            htmlFor="isFree"
                            className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >Free Ticket</label>
                                <Checkbox 
                              checked={field.value}
                              onCheckedChange={field.onChange}

                                id="isFree"
                                className="mr-2 h-5 w-5 border-2 border-primary-500"
                                />
                                    
                              </div>
                            </FormControl> 
                            <FormMessage />
                          </FormItem>
          )}
        />
                      
                </div>
              </FormControl> 
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem className=" w-full">
            
              <FormControl>
              <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                <Image 
                  src="/assets/icons/link.svg"
                  alt="dollar"
                  width={24}
                  height={24}
                  className="filter-grey"
                  />
                <Input  className="input-field" placeholder="URL" {...field} />
                </div>
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />

        </div>

    

        <Button
        size="lg"
        disabled={form.formState.isSubmitting}
        className="button col-span-2 w-full"
        type="submit"
        >
           {
           form.formState.isSubmitting ? "Submitting..."  : `${type} Event`
          } 
      
          </Button>
      </form>
    </Form>
  )
}

export default EventForm
