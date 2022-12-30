// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { search_tag_upload } from '../../../apis';
import prisma from '../../../lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const get_our_picks = await prisma.ourPicks.findMany();
      cloudinary.search
        .expression(`tags=ourpicks`)
        .execute()
        .then(async (result) => {
          const our_picks = result?.resources;
          if (get_our_picks.length === 0) {
            const l = await Promise.all(
              our_picks.map(async (item: any) => {
                const { public_id } = item;
                const result = await cloudinary.api.resource(public_id);
                const element = {
                  style_name: result.metadata.style,
                  image_url: result.secure_url,
                  public_id,
                };
                return element;
              })
            );

            const create_our_picks = await prisma.ourPicks.createMany({
              data: l,
            });
            console.log({ create_our_picks });
            return res.status(200).json({
              success: 1,
              mesg: 'Our Picks',
              data: l,
              size: l.length,
            });
          } else if (get_our_picks.length !== our_picks.length) {
            const l = await Promise.all(
              our_picks.map(async (item: any) => {
                const { public_id } = item;
                const result = await cloudinary.api.resource(public_id);
                const element = {
                  style_name: result.metadata.style,
                  image_url: result.secure_url,
                  public_id,
                };
                return element;
              })
            );
            const delete_our_picks = await prisma.ourPicks.deleteMany();
            const create_our_picks = await prisma.ourPicks.createMany({
              data: l,
            });
            return res.status(200).json({
              success: 1,
              mesg: 'Our Picks',
              data: l,

              size: l.length,
            });
          } else {
            return res.status(200).json({
              success: 1,
              mesg: 'Our Picks',
              data: get_our_picks,
              size: get_our_picks.length,
            });
          }
        });
    } catch (err: any) {
      throw new Error(err);
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
