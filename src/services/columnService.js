//import ApiError from '~/utils/ApiError'
import { columnModel } from '~/models/columnModel'
const createNew = async(reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // xu ly logic
    const newColumn = {
      ...reqBody
    }
    const createdColumn = await columnModel.createNew(newColumn)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

    //...
    return getNewColumn
  } catch (err) {
    throw err
  }
}

export const columnService = {
  createNew
}