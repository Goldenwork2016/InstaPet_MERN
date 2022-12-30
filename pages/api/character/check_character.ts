import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Characters } from '../../../apis/api.interface';

export default async function upload(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { name }: Characters = req.body;
  name = name.toLowerCase();

  if (req.method === 'POST') {
    const checkUnique = await prisma.characters.findUnique({
      where: {
        name,
      },
    });
    if (checkUnique) {
      return res.status(StatusCodes.OK).json({
        success: 0,
        mesg: 'Character name already exists',
      });
    }
    return res.status(StatusCodes.OK).json({
      success: 1,
      mesg: 'Valid name',
    });
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
