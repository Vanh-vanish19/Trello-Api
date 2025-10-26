import { StatusCodes } from 'http-status-codes'

const createNew = async(req, res, next) =>{
  try {
    console.log(req.body)
    console.log(req.query)
    console.log(req.params)
    console.log(req.files)
    console.log(req.cookies)
    // route huong du lieu sang service xu ly
    res.status(StatusCodes.CREATED).json({ message : 'Post from controller', status: StatusCodes.CREATED })
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors : err.message
    })
  }
}
export const boardController = {
  createNew
}