//import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/fommaters'
const createNew = async(reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // xu ly logic
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    // goi model de luu vao db
    // xu ly email
    // xu ly notify
    // return kq ve service
    return newBoard
  } catch (err) {
    throw err
  }
}

export const boardService = {
  createNew
}