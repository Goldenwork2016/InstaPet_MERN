import { AxiosResponse } from 'axios';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userid, key } = req.body;

  if (req.method === 'POST') {
    if (!userid) {
      return res.status(400).json({
        success: 0,
        mesg: 'Username is required',
      });
    }
    if (!key) {
      return res.status(400).json({
        success: 0,
        mesg: 'Key is required',
      });
    }
    return new Promise(async (resolve, reject) => {
      var data = JSON.stringify({
        credentials: {
          userid,
          key,
        },
      });

      const config = {
        method: 'post',
        url: process.env.COREWEAVE_URL +  '/get_pretrained',

        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      };
      try {
        const { data } = (await axios(config)) as AxiosResponse;
        const {
          pretrained_models,
        }: { pretrained_models: { model_name: string; status: number }[] } =
          data;
        const models: any = [];
        await Promise.all(
          pretrained_models.map(async ({ model_name, status }) => {
            const { resources } = await cloudinary.search
              .expression(`tags=thumb-${userid}-${model_name}`)
              .execute();
            const public_id = resources?.[0]
              ? resources?.[0].public_id
              : new Date().getTime().toString();
            const image_url = resources?.[0] ? resources?.[0].url : '';
            if (!resources.length) {
              console.log({ model_name, public_id, image_url });
              return;
            }
            models.push({
              model_name,
              status,
              public_id,
              image_url,
            });
          })
        );

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(models));

        resolve(true);
      } catch (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(err));
        resolve(true);
      }
    });
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
function hasSameItems(
  arr1: string[],
  arr2: string[]
): { hasSameItems: boolean; unMatchedItems: string[] } {
  const unMatchedItems = arr2.filter((item) => !arr1.includes(item));
  return {
    hasSameItems: !unMatchedItems.length,
    unMatchedItems,
  };
}
