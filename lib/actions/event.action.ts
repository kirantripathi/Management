"use server"

import { promises as fs } from 'fs';
import { CreateEventParams, DeleteEventParams, GetAllEventsParams, GetEventsByUserParams, GetRelatedEventsByCategoryParams, UpdateEventParams } from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import User from "../database/model/users.model"
import Event from "../database/model/event.model"
import Category from "../database/model/category.model"
import { revalidatePath } from "next/cache"








const getCategoryByName = async (name: string) => {
  //caase insensitive matching is done as $options:"i" make it possible

  return Category.findOne({ name: { $regex: name, $options: 'i' } })
}

const populateEvent = (query: any) => {
    return query
      .populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
      .populate({ path: 'category', model: Category, select: '_id name' })
  }

export const createEvent = async ({event,userId,path}:CreateEventParams) => {

    try {
    

      // const result = await cloudinary.uploader.upload(event.imageUrl);
      // console.log(result,"See the result plz")
    
        await connectToDatabase();
        //find the organizer of the event
        const organizer = await User.findById(userId);
        if(!organizer) {
            throw new Error('Organizer not found')
        }
            const newEvent = await Event.create({...event,category:event.categoryId,organizer:userId})
            // revalidatePath(path)
            return JSON.parse(JSON.stringify(newEvent))

       
    }
    catch(error) {
        handleError(error);
    }

}

export const getEventById = async (eventId:string) => {
 try {
    await connectToDatabase();
    const event = await populateEvent(Event.findById(eventId));
    if (!event) throw new Error('Event not found')
    return JSON.parse(JSON.stringify(event))
 }
 catch(error) {
    handleError(error)
 }
}

export const getAllEvents = async ({query,limit=6,page,category}:GetAllEventsParams) => {
   
  try {
        await connectToDatabase();
        const titleCondition = query ? { title: { $regex: query, $options: 'i' } } : {}
        const categoryCondition = category ? await getCategoryByName(category) : null
        const conditions = {
          $and: [titleCondition, categoryCondition ? { category: categoryCondition._id } : {}],
        }
        //condition checks for both tilecondition and category condition.
        //if category condition exist it search for categoryCondition._id otherwise just with title condition
        const skipAmount = (Number(page) - 1) * limit
        const eventsQuery = Event.find(conditions)
        .sort({createdA:"desc"})
        .skip(skipAmount)
        .limit(limit);
        const events= await populateEvent(eventsQuery);
        const eventsCount = await Event.countDocuments(conditions);
        return {
            data:JSON.parse(JSON.stringify(events)),
            totalPages : Math.ceil(eventsCount/limit)
        }
    }
    catch(error) {
       handleError(error)
    }
   }

export  const deleteEvent = async({eventId,path}:DeleteEventParams) => {
    try {
        await connectToDatabase()
    
        const deletedEvent = await Event.findByIdAndDelete(eventId)
        if (deletedEvent) revalidatePath(path)
      } catch (error) {
        handleError(error)
      }
} 

// UPDATE
export async function updateEvent({ userId, event, path }: UpdateEventParams) {
    try {
      await connectToDatabase()
  
      const eventToUpdate = await Event.findById(event._id)
      console.log(eventToUpdate,"see tu")
      if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== userId) {
        throw new Error('Unauthorized or event not found')
      }
  
      const updatedEvent = await Event.findByIdAndUpdate(
        event._id,
        { ...event, category: event.categoryId },
        { new: true }
      )
      revalidatePath(path)
  
      return JSON.parse(JSON.stringify(updatedEvent))
    } catch (error) {
      handleError(error)
    }
  }

  // GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
export async function getRelatedEventsByCategory({
  categoryId,
  eventId,
  limit = 3,
  page = 1,
}: GetRelatedEventsByCategoryParams) {
  try {
    await connectToDatabase()

    const skipAmount = (Number(page) - 1) * limit
    // It uses the $and operator to specify that all conditions within the array must be met.
    // The conditions specify that:
    // The category field of the document must match the categoryId value.
    // The _id field of the document must not match the eventId value (using the $ne operator).
    const conditions = { $and: [{ category: categoryId }, { _id: { $ne: eventId } }] }
    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const events = await populateEvent(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
  } catch (error) {
    handleError(error)
  }
}


// GET EVENTS BY ORGANIZER
export async function getEventsByUser({ userId, limit = 6, page }: GetEventsByUserParams) {
  try {
    await connectToDatabase()

    const conditions = { organizer: userId }
    const skipAmount = (page - 1) * limit

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const events = await populateEvent(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
  } catch (error) {
    handleError(error)
  }
}
