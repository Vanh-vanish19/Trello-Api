import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
const createNew = async(req, res, next ) =>{
  try {
    // console.log(req.body)
    // console.log(req.query)
    // console.log(req.params)
    // console.log(req.files)
    // console.log(req.cookies)
    // route huong du lieu sang service xu ly
    //throw new ApiError(StatusCodes.BAD_REQUEST, 'Error test middleware handling central')
    res.status(StatusCodes.CREATED).json({ message : 'Post from controller', status: StatusCodes.CREATED })
  } catch (err) {
    next(err)
  }
}
export const boardController = {
  createNew
}