import express from 'express'
import { cardValidation } from '~/validations/cardValidation'
import { cardController } from '~/controllers/cardController'
import { authMiddleware } from '~/middlewares/authMiddlewares'

const Router = express.Router()

Router.route('/')
  .post(authMiddleware.isAuthorize, cardValidation.createNew, cardController.createNew)
Router.route('/:id')
  .put(authMiddleware.isAuthorize, cardValidation.update, cardController.update)
export const cardRoutes = Router