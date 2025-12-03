import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { CARD_MEMBER_ACTION } from '~/utils/constants'
// Define Collection (name & schema)
const CARD_COLLECTION_NAME = 'cards'
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),
  cover: Joi.string().default(null),
  memberIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  comments: Joi.array().items({
    _id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    userEmail:  Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    userDisplayName: Joi.string().min(3).max(50).trim().strict(),
    userAvatar: Joi.string(),
    content: Joi.string(),
    commentedAt: Joi.date().timestamp()
  }).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELD = ['_id', 'boardId', 'createdAt']
const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {throw new Error(error)}
}

const validateBeforeCreate = async (data) => {
  return await CARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly : false })
}
const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    //console.log(validData)
    const createdCard = await GET_DB().collection(CARD_COLLECTION_NAME).insertOne({
      ...validData,
      boardId: new ObjectId(validData.boardId),
      columnId: new ObjectId(validData.columnId)
    })
    return createdCard
  } catch (error) {throw new Error(error)}
}


const update = async (cardId, updateData) => {
  try {
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELD.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    if (updateData.columnId) updateData.columnId = new ObjectId(updateData.columnId)

    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(cardId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteManyById = async (columnId) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).deleteMany({ columnId: new ObjectId(columnId) })
    // console.log(result)
    return result
  } catch (error) {throw new Error(error)}
}

const unshiftNewComment = async (cardId, commentData) => {
  try {
    // Always assign an _id to subdocument comments
    commentData._id = new ObjectId().toString()
    const newCommentData = {
      ...commentData,
      _id: commentData._id,
      commentedAt: Date.now()
    }
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(cardId) },
      { $push: { comments: { $each: [newCommentData], $position: 0 } } },
      { returnDocument: 'after' }
    )
    return result
  }
  catch (error) {
    throw new Error(error)
  }
}

const updateMember = async (cardId, incomingMemberInfo) => {
  try {
    let updateCondition = {}

    if (incomingMemberInfo.action === CARD_MEMBER_ACTION.ADD) {
      updateCondition = {
        $push: { memberIds: new ObjectId(incomingMemberInfo.userId) }
      }
    }

    if (incomingMemberInfo.action === CARD_MEMBER_ACTION.REMOVE) {
      updateCondition = {
        $pull: { memberIds: new ObjectId(incomingMemberInfo.userId) }
      }
    }
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(cardId) },
      updateCondition,
      { returnDocument: 'after' }
    )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteComment = async (cardId, commentId) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(cardId) },
      { $pull: { comments: { _id: commentId } } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const editComment = async (cardId, commentId, newContent) => {
  try {
    const newContentData = {
      'comments.$.content': newContent,
      'comments.$.commentedAt': Date.now()
    }
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id : new ObjectId(cardId), 'comments._id': commentId },
      { $set: newContentData },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  update,
  deleteManyById,
  unshiftNewComment,
  updateMember,
  deleteComment,
  editComment
}