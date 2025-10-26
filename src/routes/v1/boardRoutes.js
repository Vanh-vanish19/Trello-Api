/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidations } from '~/validations/boardValidations'
import { boardController } from '~/controllers/boardController'
const Router = express.Router()

Router.route('/')
  .get(( req, res ) => {
    res.status(StatusCodes.OK).json({ message : 'Board route works', status: StatusCodes.OK })
  })
  .post(boardValidations.createNew, boardController.createNew)

export const boardRoutes = Router