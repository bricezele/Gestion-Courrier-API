/**
 * Project yoolearn-backend
 * File index
 * Path src/util
 * Created by BRICE ZELE
 * Date: 09/09/2021
 */
import {extname} from 'path';
import {Express, Request} from 'express';
import {FileUsage} from '../enum/fileusage.enum';

export const groupArrayOfObjectsByCategorie = (keys, property) => array => {
    return array.reduce((objectsByKeyValue, obj) => {
        const value = obj[keys][property];
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
    }, {});
};

export const groupArrayOfObjects = keys => array => {
    return array.reduce((objectsByKeyValue, obj) => {
        const value = keys.map(key => obj[key]).join('-');
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
    }, {});
};

export const fileFilter = (req, file, callback) => {
    if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif|webm|mkv|flv|mp4|vob|avi|mpg|mpeg|3gp)$/)) {
        return callback(new Error('This file are not allowed!'), false);
    }
    callback(null, true);
};

const generateMongoObjectId = () => {
    const timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
    return (
        timestamp +
        'xxxxxxxxxxxxxxxx'
            .replace(/[x]/g, function() {
                return ((Math.random() * 16) | 0).toString(16);
            })
            .toLowerCase()
    );
};

export const uploadFileName = (
    req: Request,
    file: Express.Multer.File,
    callback,
) => {
    const fileExtName = extname(file.originalname);
    let filename = req.query.filename;

    switch (req.query.type) {
        case FileUsage.PROFILE_IMAGE:
            filename = req.query.userId;
            break;
        case FileUsage.SKILL_IMAGE:
            filename = req.query.skillId;
            break;
        case FileUsage.SKILL_CATEGORY_IMAGE:
            filename = req.query.skillCategoryId;
            break;
        case FileUsage.WORKSHOP_IMAGE:
            filename = generateMongoObjectId();
            break;
        case FileUsage.TRAINING_IMAGE:
            filename = generateMongoObjectId();
            break;
        case FileUsage.TRAINING_VIDEO:
            filename = generateMongoObjectId();
            break;
        case FileUsage.TRAINING_VIDEO_POSTER_IMAGE:
            filename = generateMongoObjectId();
            break;
    }
    callback(
        null,
        `YOOLEARN_MEDIA_${req.query.entity}_${filename}${fileExtName}`,
    );
};

export const uploadDestinationFolder = (
    req: Request,
    file: Express.Multer.File,
    callback,
) => {
    let folderName = `./${process.env.ROOT_UPLOAD_FOLDER}`;
    switch (req.query.type) {
        case FileUsage.PROFILE_IMAGE:
            folderName += `/${process.env.PROFILE_PICTURE_UPLOAD_FILE}`;
            break;
        case FileUsage.SKILL_IMAGE:
            folderName += `/${process.env.SKILL_PICTURE_UPLOAD_FILE}`;
            break;
        case FileUsage.SKILL_CATEGORY_IMAGE:
            folderName += `/${process.env.SKILL_CATEGORY_PICTURE_UPLOAD_FILE}`;
            break;
        case FileUsage.WORKSHOP_IMAGE:
            folderName += `/${process.env.WORKSHOP_IMAGE_UPLOAD_FILE}`;
            break;
        case FileUsage.TRAINING_IMAGE:
            folderName += `/${process.env.TRAINING_UPLOAD_FILE}`;
            break;
        case FileUsage.TRAINING_VIDEO:
            folderName += `/${process.env.TRAINING_UPLOAD_FILE}`;
            break;
        case FileUsage.TRAINING_VIDEO_POSTER_IMAGE:
            folderName += `/${process.env.TRAINING_UPLOAD_FILE}`;
            break;
    }

    callback(null, folderName);
};
