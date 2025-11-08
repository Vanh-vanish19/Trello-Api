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

const update = async (req, res, next ) => {
  try {
    const updateColumn = await columnService.update(req.params.id, req.body)
    res.status(StatusCodes.OK).json(updateColumn)
  } catch (err) {
    next(err)
  }
}

const deleteItem = async (req, res, next ) => {
  try {
    const result = await columnService.deleteItem(req.params.id)
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const columnController = {
  createNew,
  update,
  deleteItem
}