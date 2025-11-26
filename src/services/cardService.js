//import ApiError from '~/utils/ApiError'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'
const createNew = async(reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // xu ly logic
    const newCard = {
      ...reqBody
    }
    const createdCard = await cardModel.createNew(newCard)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)

    if (getNewCard) {
      await columnModel.pushCardOrderIds(getNewCard)
    }
    return getNewCard
  } catch (err) {
    throw err
  }
}

const update = async (cardId, reqBody, cardCoverFile, userInfo ) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    let updatedCard = {}
    if (cardCoverFile) {
      const result = await CloudinaryProvider.streamUpload(cardCoverFile.buffer, 'card-cover')
      updatedCard = await cardModel.update(cardId, {
        cover: result.secure_url
      })
    }
    else if ( updateData.commentToAdd ) {
      const commentData = {
        ...updateData.commentToAdd,
        commentedAt: Date.now(),
        userId: userInfo._id,
        userEmail: userInfo.email
      }
      // unshift push vao dau mang
      updatedCard = await cardModel.unshiftNewComment(cardId, commentData)
    }
    else {
      updatedCard = await cardModel.update(cardId, updateData)
    }
    return updatedCard
  } catch (err) {
    throw err
  }
}

export const cardService = {
  createNew,
  update
}