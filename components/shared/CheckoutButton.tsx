"use client"

import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import { IEvent } from "@/lib/database/model/event.model"
import { Button } from '../ui/button';
import Link from 'next/link';
import Checkout from './Checkout';


const CheckoutButton = ({event}:{event:IEvent}) => {
//client component so using useUser() from clerk
    const { user } = useUser();
    const userId = user?.publicMetadata.userId as string;
    //before purchasing we are checking if the event is past it's end date time 
    const hasEventFinished = new Date(event?.endDateTime) < new Date()
  return (
    <div className="flex items-center gap-3">
      {hasEventFinished ? (
        <p className="p-2 text-red-400">Sorry, tickets are no longer available.</p>
      ): (
        <>
          <SignedOut>
            <Button asChild className="button rounded-full" size="lg">
              <Link href="/sign-in">
                Get Tickets
              </Link>
            </Button>
          </SignedOut>

          <SignedIn>
            <Checkout event={event} userId={userId} />
          </SignedIn>
        </>
      )}
    </div>
  )
}

export default CheckoutButton