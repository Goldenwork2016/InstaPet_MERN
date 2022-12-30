import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Characters } from '../../../apis/api.interface';

export default async function favorites(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userid } = req.body;

  if (req.method === 'POST') {
    const data = await prisma.generatedCharacters.findMany({
      where: {
        userId: userid,
      },
    });
    return res.status(StatusCodes.OK).json({
      success: 1,
      mesg: 'Valid name',
      data: data,
    });
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
