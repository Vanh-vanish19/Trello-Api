import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPES } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
const createNew = async(req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      // custom error messages
      'string.base': 'Title must be a string',
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title must be at most 50 characters long'
    }),
    description : Joi.string().required().min(3).max(256).trim().strict().messages({
      'string.base': 'Description must be a string',
      'string.empty': 'Description is required',
      'string.min': 'Description must be at least 3 characters long',
      'string.max': 'Description must be at most 256 characters long'
    }),
    type : Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required()
  })
  try {
    // abortEarly: false => hien thi tat ca loi
    await correctCondition.validateAsync(req.body, { abortEarly : false })
    // validate data sau do thi req sang controller
    next()
  }
  catch (err) {
    //console.log(err)
    const errorMessages = new Error(err).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessages)
    next(customError)
  }
}

const update = async(req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().min(3).max(50).trim().strict(),
    description : Joi.string().min(3).max(256).trim().strict(),
    type : Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE),
    columnOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
  })
  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly : false,
      allowUnknown : true
    })
    next()
  }
  catch (err) {
    //console.log(err)
    const errorMessages = new Error(err).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessages)
    next(customError)
  }
}

const moveCardDiffCol = async(req, res, next) => {
  const correctCondition = Joi.object({
    currentCardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    prevColumnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    prevCardOrderIds: Joi.array().required().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)),
    nextColumnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    nextCardOrderIds: Joi.array().required().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
  })
  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly : false
    })
    next()
  }
  catch (err) {
    //console.log(err)
    const errorMessages = new Error(err).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessages)
    next(customError)
  }
}

export const boardValidation = {
  createNew,
  update,
  moveCardDiffCol
}

