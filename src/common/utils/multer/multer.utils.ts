import { BadRequestException } from "@nestjs/common"
import { diskStorage } from "multer"
import { extname } from "path"


export const uploadFileOption = {
    storage : diskStorage({
      destination : './src/uploads',
      filename : (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        const ext = extname(file.originalname)
        const filename = `${file.originalname}-${uniqueSuffix}-${ext}`
        cb(null, filename)
      }
    }),
    limits : {
      fileSize : 5 * 1024 * 1024
    },
    fileFilter : (req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) 
        return cb (new BadRequestException ('File must be an image'), false);
     cb (null, true);
     }
  }

export const uploadFilesOption = {
    storage : diskStorage({
      destination : './src/uploads',
      filename : (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        const ext = extname(file.originalname)
        const filename = `${file.originalname}-${uniqueSuffix}-${ext}`
        cb(null, filename)
      }
    }),
    limits : {
      fileSize : 5 * 1024 * 1024
    },
    fileFilter : (req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) 
        return cb (new BadRequestException ('File must be an image'), false);
     cb (null, true);
     }
  }