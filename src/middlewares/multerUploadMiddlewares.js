import multer from 'multer'
import ApiError from '~/utils/ApiError'
import { ALLOW_COMMON_FILE_TYPES, LIMIT_COMMON_FILE_SIZE } from '~/utils/validators'
import { StatusCodes } from 'http-status-codes'


//func check file được chấp nhận
const customFileFilter = (req, file, cb) => {
  // đối với multer kiểm tra file thì sử dụng mimetype
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
    const errMessage = 'File type is invalid. Only accept jpg, jpeg and png'
    return cb(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errMessage), null)
  }
  return cb(null, true)
}

const upload = multer({
  limits:{ fileSize: LIMIT_COMMON_FILE_SIZE },
  fileFilter: customFileFilter
})

export const multerUploadMiddlewares = { upload }