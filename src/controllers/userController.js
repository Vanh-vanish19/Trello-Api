import { StatusCodes } from 'http-status-codes'
//import ApiError from '~/utils/ApiError'
import { userService } from '~/services/userService.js'

const createNew = async(req, res, next ) => {
  try {
    // route huong du lieu sang service xu ly
    const createUser = await userService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createUser)
  } catch (err) {
    next(err)
  }
}

const verifyAccount = async(req, res, next ) => {
  try {
    // route huong du lieu sang service xu ly
    const result = await userService.verifyAccount(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const login = async(req, res, next ) => {
  try {
    // route huong du lieu sang service xu ly
    const result = await userService.login(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const userController = {
  createNew,
  verifyAccount,
  login
}