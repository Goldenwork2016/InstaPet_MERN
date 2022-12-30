// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { user_type, sessionImages } from '../../../apis/api.interface';
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId, images_base_64 }: sessionImages = req.body;
  let { user } = req.query;
  user = user as string;

  if (req.method === 'POST') {
    try {
      const images = await prisma.sessionImages.create({
        data: {
          userId,
          images_base_64,
        },
      });
      return res.status(StatusCodes.OK).json({
        success: 1,
        mesg: ReasonPhrases.OK,
        data: { message: 'images added successfully' },
      });
    } catch (error) {
      return {
        error: error.message,
        message: 'something went wrong',
      };
    }
  } else if (req.method === 'GET') {
    try {
      const images = await prisma.sessionImages.findFirst({
        where: {
          userId: user,
        },
      });
      return res.status(StatusCodes.OK).json({
        success: 1,
        mesg: ReasonPhrases.OK,
        data: images,
      });
    } catch (error) {
      return {
        error: error.message,
        message: 'something went wrong',
      };
    }
  } else if (req.method === 'DELETE') {
    try {
      const images = await prisma.sessionImages.deleteMany({
        where: {
         userId:user,
        },
      });

      return res.status(StatusCodes.OK).json({
        success: 1,
        mesg: ReasonPhrases.OK,
        data: images,
      });
    } catch (error) {
      return {
        error: error.message,
        message: 'something went wrong',
      };
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
