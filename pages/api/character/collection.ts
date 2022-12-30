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
    const data = await prisma.generatedCharacters.findMany({
      where: {
        userId: userid,
        is_favorite: true,
      },
    });

    const grouped_data: Array<{}> = groupBy(data, 'model_name');

    const other_creator = await prisma.generatedCharacters.findMany({
      where: {
        userId: {
          notIn: userid,
        },
        is_favorite: true,
      },
    });

    //   const new_group:any = {}
    // for (const key in grouped_data) {
    // const username:any = await get_username(key)
    //     new_group[username] = grouped_data[key];
    // }
    return res.status(StatusCodes.OK).json({
      success: 1,
      mesg: 'Data Retrived',
      data: grouped_data,
      other_creator,
    });
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
