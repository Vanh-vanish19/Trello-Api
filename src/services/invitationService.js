/* eslint-disable no-useless-catch */
import { userModel } from '~/models/userModel'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { invitationModel } from '~/models/invitationModel'
import { INVITATION_TYPES, BOARD_INVITATION_STATUS } from '~/utils/constants'
import { pickUser } from '~/utils/formatters'
import { get } from 'lodash'
import { ObjectId } from 'mongodb'

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

const getInvitations = async(reqBody, userId) => {
  try {
    const getInvitations = await invitationModel.findByUser(userId)

    const resInvitations = getInvitations.map(i => {
      return {
        ...i,
        inviter: i.inviter[0] || {},
        invitee: i.invitee[0] || {},
        board: i.board[0] || {}
      }
    })
    return resInvitations
  } catch (err) {
    throw err
  }
}

const update = async (userId, invitationId, status) => {
  try {
    const getInvitation = await invitationModel.findOneById(invitationId)
    if (!getInvitation) throw new ApiError(StatusCodes.NOT_FOUND, 'Invitation not found')
    const boardId = getInvitation.boardInvitation.boardId
    const getBoard = await boardModel.findOneById(boardId)
    if (!getBoard) throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')

    const boardOwnerAndMemberIds = [...getBoard.ownerIds, ...getBoard.memberIds].toString()
    if (boardOwnerAndMemberIds.includes(userId) && status === BOARD_INVITATION_STATUS.ACCEPTED) {
      throw new ApiError(StatusCodes.CONFLICT, 'You are already a member of this board')
    }
    // create data to update invitation
    const updateData = {
      boardInvitation:{
        ...getInvitation.boardInvitation,
        status: status
      }
    }
    const updatedInvitation = await invitationModel.update(invitationId, updateData)

    if (updatedInvitation.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED) {
      await boardModel.pushMemberIds(boardId, userId)
    }
    return updatedInvitation
  } catch (err) {
    throw err
  }
}

export const invitationService = {
  createNewBoardInvitation,
  getInvitations,
  update
}