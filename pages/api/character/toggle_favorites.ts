// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Characters } from "../../../apis/api.interface";

export default async function favorites(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(StatusCodes.CONFLICT).json({
        success: 0,
        mesg: "Please provide a user_id",
      });
    }
    if (req.query.all === "true") {
      const characters = await prisma.favouriteCharacter.findMany({
        where: {
          user_id: user_id,
        },
      });
      return res.status(StatusCodes.OK).json({
        success: 1,
        mesg: ReasonPhrases.OK,
        data: characters,
      });
    }
    const { public_id, url } = req.body;
    if (!public_id) {
      return res.status(StatusCodes.CONFLICT).json({
        success: 0,
        mesg: "Please provide a public_id",
      });
    }
    if (!url) {
      return res.status(StatusCodes.CONFLICT).json({
        success: 0,
        mesg: "Please provide a url",
      });
    }

    const find_imagee = await prisma.favouriteCharacter.findFirst({
      where: {
        public_id,
      },
    });

    if (find_imagee) {
      await prisma.favouriteCharacter.delete({
        where: {
          id: find_imagee.id,
        },
      });
    } else {
      await prisma.favouriteCharacter.create({
        data: {
          public_id,
          url,
          user_id,
        },
      });
    }

    return res.status(StatusCodes.OK).json({
      success: 1,
      mesg: "Toggle Complete",
    });
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
