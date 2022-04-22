/**
 * Project yoolearn-backend
 * File index
 * Path src/util
 * Created by BRICE ZELE
 * Date: 09/09/2021
 */
import { extname } from "path";
import { Express, Request } from "express";
import { FileUsage } from "../enum/fileusage.enum";

export const groupArrayOfObjectsByCategorie = (keys, property) => array => {
    return array.reduce((objectsByKeyValue, obj) => {
        const value = obj[keys][property];
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
    }, {});
};

export const groupArrayOfObjects = keys => array => {
    return array.reduce((objectsByKeyValue, obj) => {
        const value = keys.map(key => obj[key]).join("-");
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
    }, {});
};

export const fileFilter = (req, file, callback) => {
    if (
      !file.originalname
        .toLowerCase()
        .match(
          /\.(jpg|jpeg|png|gif|webm|mkv|flv|mp4|vob|avi|mpg|mpeg|3gp)$/
        )
    ) {
        return callback(new Error("This file are not allowed!"), false);
    }
    callback(null, true);
};

const generateMongoObjectId = () => {
    const timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
    return (
      timestamp +
      "xxxxxxxxxxxxxxxx"
        .replace(/[x]/g, function() {
            return ((Math.random() * 16) | 0).toString(16);
        })
        .toLowerCase()
    );
};

export const uploadFileName = (
  req: Request,
  file: Express.Multer.File,
  callback
) => {
    const fileExtName = extname(file.originalname);
    let filename = req.query.filename;

    switch (req.query.type) {
        case FileUsage.COURRIER_IMAGE:
            filename = req.query.courrierId;
            break;
        case FileUsage.COURRIER_IMAGE_ANNEXE:
            filename = generateMongoObjectId();
            break;
    }
    callback(null, `FGT_MEDIA_${req.query.entity}_${filename}${fileExtName}`);
};

export const uploadDestinationFolder = (
  req: Request,
  file: Express.Multer.File,
  callback
) => {
    let folderName = `./${process.env.ROOT_UPLOAD_FOLDER}`;
    switch (req.query.type) {
        case FileUsage.COURRIER_IMAGE:
            folderName += `/${process.env.COURRIER_IMAGE_UPLOAD_FOLDER}`;
            break;
        case FileUsage.COURRIER_IMAGE_ANNEXE:
            folderName += `/${process.env.COURRIER_IMAGE_UPLOAD_FOLDER}`;
            break;
        case FileUsage.COURRIER_DOCUMENT:
            folderName += `/${process.env.COURRIER_IMAGE_UPLOAD_FOLDER}`;
            break;
        case FileUsage.COURRIER_VIDEO:
            folderName += `/${process.env.COURRIER_IMAGE_UPLOAD_FOLDER}`;
            break;
    }

    callback(null, folderName);
};
