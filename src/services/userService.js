import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { BrevoProvider } from '~/providers/BrevoProvider'
import { tokenProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'

const createNew = async(reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // kiểm tra email có tồn tại ko
    const existUser = await userModel.findOneByEmail(reqBody.email)

    if (existUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exists')
    }
    // tạo data => database
    const nameFromEmail = reqBody.email.split('@')[0]
    const newUser ={
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8), // 8 là độ phức tạp càng cao càng lâu
      userName: nameFromEmail,
      displayName: nameFromEmail,

      verifyToken : uuidv4()
    }
    // save to DB
    const createdUser = await userModel.createNew(newUser)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)
    // gửi mail xác thực
    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
    const customSubject = 'Trello : Please verify your email before using our service'

    const htmlContent = `
      <h3>Here is your verification<h3/>
      <h3>${verificationLink}<h3/>
      <br/>
      <h3>Thank you <33333<h3/>
    `
    // call provider to sent mail
    await BrevoProvider.sendEmail(getNewUser.email, customSubject, htmlContent)

    //return controller
    return pickUser(getNewUser)
  } catch (err) {
    throw err
  }
}

const verifyAccount = async(reqBody) => {
  try {
    //
    const existUser = await userModel.findOneByEmail(reqBody.email)

    // kiểm tra cần thiết
    if (!existUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found')
    }

    if (existUser.isActive) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Account already activated')
    }

    if (reqBody.token !== existUser.verifyToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token')
    }

    // update user
    const updateData = {
      isActive: true,
      verifyToken: null
    }

    const updatedUser = await userModel.update(existUser._id, updateData)

    return pickUser(updatedUser)
  } catch (error) {
    throw Error(error)
  }
}

const login = async(reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email)

    // kiểm tra cần thiết
    if (!existUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found')
    }

    if (!existUser.isActive) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Account not active! Please check your email')
    }

    if (!bcryptjs.compareSync(reqBody.password, existUser.password)) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Your Email or Password is incorrect')
    }


    // tạo token đăng nhập để trả về FE
    // JWT bao gồm _id và email của user
    const userInfo = {
      _id: existUser._id,
      email: existUser.email
    }
    // tạo 2 token, accessToken và refreshToken trả về Fe
    const accessToken = await tokenProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      // 5
      env.ACCESS_TOKEN_LIFE
    )

    const refreshToken = await tokenProvider.generateToken(userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_LIFE
      // 15
    )
    return {
      accessToken,
      refreshToken,
      ...pickUser(existUser)
    }
  } catch (error) {
    throw Error(error)
  }
}

const refreshToken = async(clientRefreshToken) => {
  try {
    // giải mã refresh token cớ hợp lệ không
    const refreshTokenDecoded = await tokenProvider.verifyToken(clientRefreshToken, env.REFRESH_TOKEN_SECRET_SIGNATURE)

    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email
    }
    // tạo 2 token, accessToken và refreshToken trả về Fe
    const accessToken = await tokenProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
      // 5
    )
    return { accessToken }
  } catch (error) {
    throw Error(error)
  }
}

const update = async(userId, reqBody, userAvtFile) => {
  try {
    // query user để kiểm tra
    const existUser = await userModel.findOneById(userId)
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Account not active!')
    // câp nhật thông tin
    let updatedUser = {}
    // change password
    if (reqBody.current_password && reqBody.new_password) {
      // kiểm tra currentPassword đúg hay ko
      if (!bcryptjs.compareSync(reqBody.current_password, existUser.password)) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Password is incorrect')
      }
      updatedUser = await userModel.update(userId, {
        password: bcryptjs.hashSync(reqBody.new_password, 8)
      })
    }
    else if (userAvtFile) {
      // upload file lên cloudinary
      const result = await CloudinaryProvider.streamUpload(userAvtFile.buffer, 'users')
      updatedUser = await userModel.update(userId, {
        avatar: result.secure_url
      })
    }
    else {
      // update khác
      updatedUser = await userModel.update(userId, reqBody)
    }
    return pickUser(updatedUser)
  } catch (error) {
    throw Error(error)
  }
}


export const userService = {
  createNew,
  verifyAccount,
  login,
  refreshToken,
  update
}