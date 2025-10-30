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
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
    // xu ly email
    // xu ly notify
    // return kq ve service
    return getNewBoard
  } catch (err) {
    throw err
  }
}

export const boardService = {
  createNew
}