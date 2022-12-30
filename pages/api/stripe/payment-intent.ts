
import { NextApiRequest, NextApiResponse } from 'next'
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

	const methods: {
		[key: string]: () => Promise<void>
	}= {
		'POST': async () => {
			const { amount, metadata } = req?.body ?? false;

			if (!amount) {
				res.status(400).json({
					error: 'Missing required fields'
				});
			}

			try {
				const paymentIntent = await stripe.paymentIntents.create({
					amount: amount * 100,
					currency: "usd",
					payment_method_types: ['card'],
					// automatic_payment_methods: {
					// 	enabled: ['card'],
					// },
					metadata: metadata
				});

				res.status(200).send({
					clientSecret: paymentIntent.client_secret,
					paymentIntentId: paymentIntent.id,
				});
			} catch (error) {
				console.log()

				res.status(500).json(error);
			}

		},
		'GET': async () => {
			const { id } = req?.query ?? false;

			if (id) {
				try {
					const paymentIntent = await stripe.paymentIntents.retrieve(id);
					res.status(200).json(paymentIntent)
				} catch (error) {
					console.error(error);
					res.status(500).json(error)
				}
			} else {
				res.status(400).json({
					error: 'Missing required fields'
				});
			}
		},
		'PUT': async () => {
			const { amount, paymentIntentId, orderId } = req?.body ?? false;

			if (!amount || !paymentIntentId || !orderId) {
				res.status(400).json({
					error: 'Missing required fields'
				});
			}

			try {
				const paymentIntent = await stripe.paymentIntents.update(
					paymentIntentId,
					{
						amount: amount * 100,
						currency: "usd",
						payment_method_types: ['card'],
						metadata: { order_id: orderId }
					}
				);

				res.status(200).send({
					clientSecret: paymentIntent.client_secret,
				});
			} catch (error) {
				console.log(error);
				res.status(500).json(error);
			}
		},
	}

	const method = methods[req.method as string]

	if (method) {
		return method()
	} else {
		return res.status(405).json({ error: 'Method not allowed' })
	}
}
// Create a PaymentIntent with the order amount and currency