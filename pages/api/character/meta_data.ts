// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name, username } = req.body;

  if (req.method === "POST") {
    if (!name)
      return res.status(400).json({
        success: 0,
        mesg: "Name is required",
      });

    return new Promise((resolve, reject) => {
      const kubaData = {
        cloudinary_tag: `${username}-${name}`,
        caption: `images for ${name}`,
        steps: 800,
        charname: name.toLowerCase(),
        credentials: {
          userid: username,
          key: "12345_unused",
        },
      };

      const config = {
        method: "post",
        url: process.env.COREWEAVE_URL + "/db_train",

        headers: {
          "Content-Type": "application/json",
        },
        data: kubaData,
      };
      console.log(1, config);
      axios(config)
        .then((result) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result.data));
          resolve(true);
        })
        .catch((error) => {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
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
