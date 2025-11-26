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

export const invitationController = {
  createNewBoardInvitation
}
