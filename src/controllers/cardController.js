import { StatusCodes } from 'http-status-codes'
//import ApiError from '~/utils/ApiError'
import { cardService } from '~/services/cardService.js'

const createNew = async(req, res, next ) => {
  try {
    // route huong du lieu sang service xu ly
    const createCard = await cardService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createCard)
  } catch (err) {
    next(err)
  }
}

export const cardController = {
  createNew
}