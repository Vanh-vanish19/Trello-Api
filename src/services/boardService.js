//import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { DEFAULT_PAGE, DEFAULT_ITEMS_PER_PAGE } from '~/utils/constants'
const createNew = async(userId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // xu ly logic
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    const createdBoard = await boardModel.createNew(userId, newBoard)
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
    // xu ly email
    // xu ly notify
    // return kq ve service
    return getNewBoard
  } catch (err) {
    throw err
  }
}

const getDetails = async (userId, boardId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const board = await boardModel.getDetails(userId, boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }
    const cloneBoard = cloneDeep(board)
    // xử lý thêm card vào column sử dụng deepclone
    cloneBoard.columns.forEach(column => {
      //equals mongoDB
      column.cards = cloneBoard.cards.filter(card => card.columnId.equals(column._id))
      // column.cards = cloneBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
    })

    delete cloneBoard.cards
    return cloneBoard
  } catch (err) {
    throw err
  }
}

const update = async (boardId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedBoard = await boardModel.update(boardId, updateData)
    return updatedBoard
  } catch (err) {
    throw err
  }
}

const moveCardDiffCol = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // cập nhật mảng cardsOrderIds của column ban đầu chứa nó (xóa _id của card)
    await columnModel.update(reqBody.prevColumnId,
      {
        cardOrderIds: reqBody.prevCardOrderIds,
        updatedAt: Date.now()
      }
    )
    // cập nhật cardsOrderIds của column kéo đến ( thêm _id của cards)
    await columnModel.update(reqBody.nextColumnId,
      {
        cardOrderIds: reqBody.nextCardOrderIds,
        updatedAt: Date.now()
      }
    )
    // cập nhật lại columnId của card đã kéo
    await cardModel.update(reqBody.currentCardId,
      {
        columnId: reqBody.nextColumnId
      }
    )
    return { updateResult: 'success' }
  } catch (err) {
    throw err
  }
}


const getBoards = async (userId, page, itemsPerPage, queryFilters) => {
  // eslint-disable-next-line no-useless-catch
  try {
    if (!page) page = DEFAULT_PAGE
    if (!itemsPerPage) itemsPerPage = DEFAULT_ITEMS_PER_PAGE
    const result = await boardModel.getBoards(userId, parseInt(page, 10), parseInt(itemsPerPage, 10), queryFilters)
    return result
  } catch (err) {
    throw err
  }
}
export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardDiffCol,
  getBoards
}