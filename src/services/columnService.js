//import ApiError from '~/utils/ApiError'
import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import ApiError from '~/utils/ApiError'
const createNew = async(reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // xu ly logic
    const newColumn = {
      ...reqBody
    }
    const createdColumn = await columnModel.createNew(newColumn)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

    if (getNewColumn) {
      getNewColumn.cards = []
      await boardModel.pushColumnOrderIds(getNewColumn)
    }
    return getNewColumn
  } catch (err) {
    throw err
  }
}

const update = async (columnId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedColumn = await columnModel.update(columnId, updateData)
    return updatedColumn
  } catch (err) {
    throw err
  }
}


const deleteItem = async (columnId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const targetColumn = await columnModel.findOneById(columnId)
    if (!targetColumn) {
      throw new ApiError(404, 'Column not found')
    }
    // xóa column
    await columnModel.deleteOneById(columnId)
    // xóa cards
    await cardModel.deleteManyById(columnId)
    // update columnOrderIds
    await boardModel.pullColumnOrderIds(targetColumn)
    return { result :'delete success' }
  } catch (err) {
    throw err
  }
}

export const columnService = {
  createNew,
  update,
  deleteItem
}