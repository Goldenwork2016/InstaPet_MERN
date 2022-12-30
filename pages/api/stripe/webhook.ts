const { buffer } = require('micro');

import { NextApiRequest, NextApiResponse } from 'next'

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function webHookHandler(req: NextApiRequest, res: NextApiResponse) {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    if (req.method === 'POST') {
        const buf = await buffer(req);
        const sig = req.headers['stripe-signature'];
        const webHookSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET;

        let event

        // to make sure the event is from stripe
        try {
            if (!sig || !webHookSecret) return

            event = stripe.webhooks.constructEvent(buf, sig, webHookSecret)
        } catch (error) {
            console.log(error)
            return res.status(400).send(`Webhook Error: ${error.message}`)
        }

        console.log(event)

        res.status(200).send('success')
    }
}