import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoutes } from './boardRoutes.js'
import { columnRoutes } from './columnRoutes.js'
import { cardRoutes } from './cardRoutes.js'
import { userRoutes } from './userRoutes.js'
import { invitationRoutes } from './invitationRoute.js'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message : 'Apis_v1 are ready', status: StatusCodes.OK })
})
//boardAPI
Router.use('/boards', boardRoutes)
//columnApi
Router.use('/columns', columnRoutes)
//cardApi
Router.use('/cards', cardRoutes)
//userApi
Router.use('/users', userRoutes)

Router.use('/invitations', invitationRoutes)

export const APIs_V1 = Router