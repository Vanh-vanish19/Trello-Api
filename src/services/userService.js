import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { BrevoProvider } from '~/providers/BrevoProvider'

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

export const userService = {
  createNew
}