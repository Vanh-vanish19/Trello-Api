import express from 'express'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'
import { authMiddleware } from '~/middlewares/authMiddlewares'

const Router = express.Router()

Router.route('/')
  .get(authMiddleware.isAuthorize, boardController.getBoards)
  .post(authMiddleware.isAuthorize, boardValidation.createNew, boardController.createNew)

Router.route('/supports/moving_card')
  .put(authMiddleware.isAuthorize, boardValidation.moveCardDiffCol, boardController.moveCardDiffCol)

Router.route('/:id')
  .get(authMiddleware.isAuthorize, boardController.getDetails)
  .put(authMiddleware.isAuthorize, boardValidation.update, boardController.update)
export const boardRoutes = Router