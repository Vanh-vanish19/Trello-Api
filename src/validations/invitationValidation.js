import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNewBoardInvitation = async(req, res, next) => {
  const correctCondition = Joi.object({
    inviteeEmail: Joi.string().required(),
    boardId: Joi.string().required()
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly : false })
    next()
  }
  catch (err) {
    const errorMessages = new Error(err).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessages)
    next(customError)
  }
}

export const invitationValidation = {
  createNewBoardInvitation
}