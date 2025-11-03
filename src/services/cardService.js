//import ApiError from '~/utils/ApiError'
import { cardModel } from '~/models/cardModel'
const createNew = async(reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // xu ly logic
    const newCard = {
      ...reqBody
    }
    const createdCard = await cardModel.createNew(newCard)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)

    //...
    return getNewCard
  } catch (err) {
    throw err
  }
}

export const cardService = {
  createNew
}