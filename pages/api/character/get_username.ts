import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

function groupBy(objectArray: Array<any>, property: string) {
  return objectArray.reduce(function (acc, obj) {
    var key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
}

export default async function favorites(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userid } = req.body;

  if (req.method === 'POST') {
    const data = await prisma.user.findUnique({
      where: {
        id: userid,
      },
    });
    const username =
      data?.name ||
      (data?.email?.includes('@') ? data?.email?.split('@')[0] : data?.email);
    // if (!username) {
    //   await prisma.characters.deleteMany({
    //     where: {
    //       userId: userid,
    //     },
    //   });
    // }
    return res.status(StatusCodes.OK).json({
      success: 1,
      mesg: 'Data Retrived',
      data: {
        username,
        details: data,
      },
    });
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
