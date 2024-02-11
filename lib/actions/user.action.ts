'use server'

import { revalidatePath } from 'next/cache'
import {CreateUserParams,UpdateUserParams} from "../../types"
import { connectToDatabase } from "../database"
import User from "../database/model/users.model"
import Event from '../database/model/event.model'
import Order from '../database/model/order.model'

import { handleError } from "../utils"

export const createUser = async (user:CreateUserParams) => 
    {

  try {
 await connectToDatabase();
 const newUser = await User.create(user);
//  The code JSON.parse(JSON.stringify(newUser)) is a common pattern used to create a deep clone of an object in JavaScript. 
 return JSON.parse(JSON.stringify(newUser));
  }
  catch(error) {
    handleError(error)
  }

    }

    export async function updateUser(clerkId: string, user: UpdateUserParams) {
        try {
          await connectToDatabase()
      
          const updatedUser = await User.findOneAndUpdate({ clerkId }, user, { new: true })
      
          if (!updatedUser) throw new Error('User update failed')
          return JSON.parse(JSON.stringify(updatedUser))
        } catch (error) {
          handleError(error)
        }
      }

      export async function deleteUser(clerkId: string) {
        try {
          await connectToDatabase()
      
          // Find user to delete
          const userToDelete = await User.findOne({ clerkId })
      
          if (!userToDelete) {
            throw new Error('User not found')
          }
      
//the $unset operator removes the specified field from the documents that match the filter criteria.

          // Unlink relationships
          await Promise.all([
            // Update the 'events' collection to remove references to the user
            Event.updateMany(
              { _id: { $in: userToDelete.events } },
              { $pull: { organizer: userToDelete._id } }
            ),
      
            // Update the 'orders' collection to remove references to the user
            Order.updateMany({ _id: { $in: userToDelete.orders } }, { $unset: { buyer: 1 } }),
          ])
      
          // Delete user
          const deletedUser = await User.findByIdAndDelete(userToDelete._id)
          revalidatePath('/')
      
          return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null
        } catch (error) {
          handleError(error)
        }

        // In summary, $unset is used to remove entire fields from documents,
        //  while $pull is used to remove specific values or elements from array fields within documents. 
      }