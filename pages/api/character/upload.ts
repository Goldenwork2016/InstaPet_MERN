import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Characters } from '../../../apis/api.interface';

export default async function upload(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, species, breed, images, user }: Characters = req.body;

  const stringifyed_images = JSON.stringify(images);
  if (!species) {
    return res.status(StatusCodes.CONFLICT).json({
      success: 0,
      mesg: 'Pleass provide species name for the characters',
    });
  }
  if (!name) {
    return res.status(StatusCodes.CONFLICT).json({
      success: 0,
      mesg: 'Pleass provide a name of the characters',
    });
  }
  // if (!breed) {
  //   return res.status(StatusCodes.CONFLICT).json({
  //     success: 0,
  //     mesg: 'Please, provide breed name for the character',
  //   });
  // }
  if (!images) {
    return res.status(StatusCodes.CONFLICT).json({
      success: 0,
      mesg: 'Please, provide images for the character',
    });
  }
  if (req.method === 'POST') {
    const instance = await prisma.characters.create({
      data: {
        userId: user,
        name: name.toLowerCase(),
        species: species,
        breed: breed,
        images: stringifyed_images,
      },
    });
    return res.status(StatusCodes.OK).json({
      success: 1,
      mesg: ReasonPhrases.OK,
      data: instance,
    });
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
