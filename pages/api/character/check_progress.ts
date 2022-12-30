// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name, userid, key } = req.body;

  if (req.method === "POST") {
    // if (!name)
    //   return res.status(400).json({
    //     success: 0,
    //     mesg: 'Name is required',
    //   });

    return new Promise((resolve, reject) => {
      var data = JSON.stringify({
        model_name: name,
        credentials: {
          userid,
          key,
        },
      });

      var config = {
        method: "post",
        url: process.env.COREWEAVE_URL + "/db_status",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then((result) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result.data));
          resolve(true);
        })
        .catch((error) => {
          console.log(error);
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
