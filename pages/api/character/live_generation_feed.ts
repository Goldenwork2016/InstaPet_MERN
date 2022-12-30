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

const get_username = async (userid: string) => {
  const data = await prisma.user.findUnique({
    where: {
      id: userid,
    },
  });
  
  return (
    data?.name ||
    (data?.email?.includes('@') ? data?.email?.split('@')[0] : data?.email)
  );
};

export default async function favorites(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userid } = req.body;

  if (req.method === 'POST') {
    const other_creator = await prisma.characters.findMany({
      where: {
        userId: {
          notIn: userid,
        },
      },
    });
    const grouped: any = {};
    for (let i of other_creator) {
      const key = i.userId;
      if (key == undefined) continue;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      i.images = JSON.parse(JSON.parse(i.images));
      grouped[key].push(i);
    }

    return res.status(StatusCodes.OK).json({
      success: 1,
      mesg: 'Data Retrived',
      data: grouped,
    });
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
