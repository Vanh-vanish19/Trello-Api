import express from 'express'
import { invitationValidation } from '~/validations/invitationValidation'
import { invitationController } from '~/controllers/invitationController'
import { authMiddleware } from '~/middlewares/authMiddlewares'

const Router = express.Router()

Router.route('/board')
  .post(authMiddleware.isAuthorize, invitationValidation.createNewBoardInvitation, invitationController.createNewBoardInvitation)

export const invitationRoutes = Router