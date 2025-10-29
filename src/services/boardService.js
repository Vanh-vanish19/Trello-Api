//import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/fommaters'
import { boardModel } from '~/models/boardModel'
const createNew = async(reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // xu ly logic
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    const createdBoard = await boardModel.createNew(newBoard)
    console.log('Created Board: ', createdBoard)

    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
    console.log('Get New Board: ', getNewBoard)
    // xu ly email
    // xu ly notify
    // return kq ve service
    return createdBoard
  } catch (err) {
    throw err
  }
}

export const boardService = {
  createNew
}