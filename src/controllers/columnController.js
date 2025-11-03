import { StatusCodes } from 'http-status-codes'
//import ApiError from '~/utils/ApiError'
import { columnService } from '~/services/columnService.js'

const createNew = async(req, res, next ) => {
  try {
    // route huong du lieu sang service xu ly
    const createColumn = await columnService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createColumn)
  } catch (err) {
    next(err)
  }
}

export const columnController = {
  createNew
}