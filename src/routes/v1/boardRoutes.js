/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidations } from '~/validations/boardValidations'
const Router = express.Router()

Router.route('/')
  .get(( req, res ) => {
    res.status(StatusCodes.OK).json({ message : 'Post form validation Board route works', status: StatusCodes.OK })
  })
  .post(boardValidations.createNew)

export const boardRoutes = Router