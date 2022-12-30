import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Generate } from "../../../apis/api.interface";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user, model_name, style_name, image_url }: Generate = req.body;

  if (req.method === "POST") {
    if (!model_name) {
      return res.status(StatusCodes.CONFLICT).json({
        success: 0,
        mesg: "Please provide a name of the characters",
      });
    }

    if (req.query.isGenerate) {
      const { style_name, username } = req.body;
      if (!style_name) {
        return res.status(StatusCodes.CONFLICT).json({
          success: 0,
          mesg: "Please provide a style name",
        });
      }
      if (!username) {
        return res.status(StatusCodes.CONFLICT).json({
          success: 0,
          mesg: "Please provide a username",
        });
      }
      return new Promise((resolve, reject) => {
        var data = JSON.stringify({
          model_name: model_name,
          seed: -1,
          style: style_name,
          count: 4,
          credentials: {
            userid: username,
            key: "12345_unused",
          },
        });
        console.log({ data });

        const config = {
          method: "post",
          url: process.env.COREWEAVE_URL + "/generate",
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
            return resolve(true);
          })
          .catch((error) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(error));
            return resolve(true);
          });
      });
    }

    if (!image_url) {
      return res.status(StatusCodes.CONFLICT).json({
        success: 0,
        mesg: "Pleass provide image url",
      });
    }
    const instance = await prisma.generatedCharacters.create({
      data: {
        userId: user,
        model_name,
        style_name,
        image_url,
        favorite_time: new Date(),
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
/*



var axios = require('axios');
var data = JSON.stringify({
 
});

var config = {
  
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});*/
