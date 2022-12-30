// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { public_id } = req.body;
  if (req.method === 'POST') {
    return new Promise((resolve, reject) => {
      // get details of the image
      if (!public_id) {
        return res.status(400).json({
          success: 0,
          mesg: 'Please provide a public_id of the image',
        });
      }
      cloudinary.api
        .resource(public_id, {
          //   image_metadata: true,
          media_metadata: true,
        })
        .then((result) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'max-age=180000');
          res.end(JSON.stringify(result));
          resolve(true);
        })
        .catch((error) => {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'max-age=180000');
          res.end(JSON.stringify(error));
          resolve(true);
        });
    });
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
