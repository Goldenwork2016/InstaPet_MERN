import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma';
import {
	ReasonPhrases,
	StatusCodes,
} from 'http-status-codes';
import sendMail from '../../../helpers/email'



export default async function index(req: NextApiRequest, res: NextApiResponse) {
  //   const email = req.body.email

  //   if (!email) {
  //     return res.status(StatusCodes.CONFLICT).json({
  //         success:0,
  //         mesg: 'Provide an email, to continue'
  //     });
  // }
  // if (req.method === "POST") {
      
  //     const instance = await prisma.authInstance.create({
  //       data: {
  //           email:email.toLowerCase()
  //         }
  //     })
  //   if (instance) {
  //     const url = req.headers.host + 'auth/' + instance.id
  //     await sendMail(email, url)
  //   }
  //     return res.status(StatusCodes.OK).json({
  //       success: 1,
  //       mesg: ReasonPhrases.OK,
  //       data: instance
  //   });

  //   } else {
  //     throw new Error(
  //       `The HTTP ${req.method} method is not supported at this route.`
  //     );
  //   }
  }