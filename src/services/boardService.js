//import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/fommaters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
const createNew = async(reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // xu ly logic
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    const createdBoard = await boardModel.createNew(newBoard)
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
    // xu ly email
    // xu ly notify
    // return kq ve service
    return getNewBoard
  } catch (err) {
    throw err
  }
}

const getDetails = async (boardId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }
    const cloneBoard = cloneDeep(board)
    // xử lý thêm card vào column sử dụng deepclone
    cloneBoard.columns.forEach(column => {
      //equals mongoDB
      column.cards = cloneBoard.cards.filter(card => card.columnId.equals(column._id))
      //column.cards = cloneBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
    })

    delete cloneBoard.cards
    return cloneBoard
  } catch (err) {
    throw err
  }
}

export const boardService = {
  createNew,
  getDetails
}