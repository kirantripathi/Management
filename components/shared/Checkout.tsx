import React from 'react';

import { loadStripe } from '@stripe/stripe-js';
import { IEvent } from "@/lib/database/model/event.model"
import { Button } from "../ui/button"
import { checkoutOrder } from '@/lib/actions/order.action';

type checkoutEventProps = {
    event: IEvent,
    userId:string
}

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
 loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''
  ) ;


const Checkout = ({event,userId}:checkoutEventProps) => {

    React.useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search);
        if (query.get('success')) {
          console.log('Order placed! You will receive an email confirmation.');
        }
    
        if (query.get('canceled')) {
          console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
        }
      }, []);
 
    const onCheckout = async () => {
        console.log("checking out now")
        const order = {
            eventTitle: event.title,
            eventId: event._id,
            price: event.price,
            isFree: event.isFree,
            buyerId: userId
          }

          checkoutOrder(order);
        
    }

  return (
    <form method="post" action={onCheckout}>
        {/* role="link" is used just to give sematic meaning like this button acts a link */}
        <Button  type="submit" role="link" size="lg" className="button sm:w-fit">
        {event.isFree ? 'Get Ticket' : 'Buy Ticket'}
        </Button>
    </form>
  )
}

export default Checkout