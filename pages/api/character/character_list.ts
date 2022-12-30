import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Characters } from '../../../apis/api.interface';

export default async function upload(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user }: Characters = req.body;

  // if (!breed) {
  //   return res.status(StatusCodes.CONFLICT).json({
  //     success: 0,
  //     mesg: 'Please, provide breed name for the character',
  //   });
  // }

  if (req.method === 'POST') {
    const characters = await prisma.characters.findMany({
      where: {
        userId: user,
      },
    });
    for (let i = 0; i < characters.length; i++) {
      characters[i].images = JSON.parse(JSON.parse(characters[i].images));
    }
    return res.status(StatusCodes.OK).json({
      success: 1,
      mesg: ReasonPhrases.OK,
      data: characters,
    });
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
