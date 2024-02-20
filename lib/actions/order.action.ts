"use server"

import Stripe from 'stripe';
import { CheckoutOrderParams, CreateOrderParams, GetOrdersByEventParams, GetOrdersByUserParams } from "@/types"
import { redirect } from 'next/navigation';
import { handleError } from '../utils';
import { connectToDatabase } from '../database';
import Order from '../database/model/order.model';
import Event from '../database/model/event.model';
import {ObjectId} from 'mongodb';
import User from '../database/model/users.model'

export const checkoutOrder = async (order: CheckoutOrderParams) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  
    //stripe takes price in cents so multiply by 100
    const price = order.isFree ? 0 : Number(order.price) * 100;
  
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              unit_amount: price,
              product_data: {
                name: order.eventTitle
              }
            },
            quantity: 1
          },
        ],
        metadata: {
          eventId: order.eventId,
          buyerId: order.buyerId,
        },
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
        cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
      });
//session.url is the url we get when the stripe opens it's payment
      console.log(session.url,"see session url now")
  
      redirect(session.url!)
    } catch (error) {
      throw error;
    }
  }



