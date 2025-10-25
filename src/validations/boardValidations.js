/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

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
    })
  })
  try {
    console.log(req.body)
    await correctCondition.validateAsync(req.body, { abortEarly : false })
    //next()
    res.status(StatusCodes.CREATED).json({ message : 'Post Board created', status: StatusCodes.CREATED })
  }
  catch (err) {
    console.log(err)
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors : new Error(err).message
    })
  }
}
export const boardValidations = {
  createNew
}

