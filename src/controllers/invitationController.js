import { StatusCodes } from 'http-status-codes'
import { invitationService } from '~/services/invitationService.js'

const createNewBoardInvitation = async(req, res, next ) => {
  try {
    const inviterId = req.jwtDecoded._id
    const result = await invitationService.createNewBoardInvitation(req.body, inviterId)
    res.status(StatusCodes.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

const getInvitations = async(req, res, next ) => {
  try {
    const userId = req.jwtDecoded._id
    const result = await invitationService.getInvitations(req.body, userId)
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}
const update = async(req, res, next ) => {
  try {
    const userId = req.jwtDecoded._id
    const { invitationId } = req.params
    const { status } = req.body
    const result = await invitationService.update(userId, invitationId, status)
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}


export const invitationController = {
  createNewBoardInvitation,
  getInvitations,
  update
}
