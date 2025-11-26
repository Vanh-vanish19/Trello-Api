import { userModel } from '~/models/userModel'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { invitationModel } from '~/models/invitationModel'
import { INVITATION_TYPES, BOARD_INVITATION_STATUS } from '~/utils/constants'
import { pickUser } from '~/utils/formatters'

const createNewBoardInvitation = async(reqBody, inviterId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const inviter = await userModel.findOneById(inviterId)

    const invitee = await userModel.findOneByEmail(reqBody.inviteeEmail)

    const board = await boardModel.findOneById(reqBody.boardId)

    if ( !inviter || !invitee || !board ) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Inviter, invitee or board not found')
    }
    // tạo data => database
    const newInvitationData = {
      inviterId,
      inviteeId: invitee._id.toString(),
      type: INVITATION_TYPES.BOARD_INVITATION,
      boardInvitation: {
        boardId: board._id.toString(),
        status: BOARD_INVITATION_STATUS.PENDING
      }
    }
    // save to DB
    const createdInvitation = await invitationModel.createNewBoardInvitation(newInvitationData)
    const getNewInvitation = await invitationModel.findOneById(createdInvitation.insertedId)

    const resInvitation = {
      ...getNewInvitation,
      board,
      inviter: pickUser(inviter),
      invitee: pickUser(invitee)
    }
    return resInvitation
  } catch (err) {
    throw err
  }
}

export const invitationService = {
  createNewBoardInvitation
}