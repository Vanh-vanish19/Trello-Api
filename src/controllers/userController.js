import { StatusCodes } from 'http-status-codes'
//import ApiError from '~/utils/ApiError'
import { userService } from '~/services/userService.js'
import ms from 'ms'
import ApiError from '~/utils/ApiError'

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

    // trả cookie về phía browser
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const logout = async(req, res, next ) => {
  try {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.status(StatusCodes.OK).json( { loggedOut: true })
  } catch (err) {
    next(err)
  }
}

const refreshToken = async(req, res, next ) => {
  try {
    const result = await userService.refreshToken(req.cookies?.refreshToken)
    res.cookie('accessToken', result.accessToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: ms('14 days') })
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(new ApiError(StatusCodes.FORBIDDEN, 'Please sign in !'))
  }
}

const update = async(req, res, next ) => {
  try {
    const userId = req.jwtDecoded._id
    const result = await userService.update(userId, req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(new ApiError(StatusCodes.FORBIDDEN, 'Please sign in !'))
  }
}

export const userController = {
  createNew,
  verifyAccount,
  login,
  logout,
  refreshToken,
  update
}