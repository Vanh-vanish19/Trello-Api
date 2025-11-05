import { StatusCodes } from 'http-status-codes'
//import ApiError from '~/utils/ApiError'
import { boardService } from '~/services/boardService.js'

const createNew = async(req, res, next ) => {
  try {
    // route huong du lieu sang service xu ly
    const createBoard = await boardService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createBoard)
  } catch (err) {
    next(err)
  }
}

const getDetails = async (req, res, next ) => {
  try {
    const board = await boardService.getDetails(req.params.id)
    res.status(StatusCodes.OK).json(board)
  } catch (err) {
    next(err)
  }
}

const update = async (req, res, next ) => {
  try {
    const updateBoard = await boardService.update(req.params.id, req.body)
    res.status(StatusCodes.OK).json(updateBoard)
  } catch (err) {
    next(err)
  }
}

export const boardController = {
  createNew,
  getDetails,
  update
}