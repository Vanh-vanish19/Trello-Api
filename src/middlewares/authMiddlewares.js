import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { tokenProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'

// middleware đảm nhiệm accessToken nhận được từ Be có hợp lệ hay ko
const isAuthorize = async (req, res, next) => {
  //lấy accessToken trong request cookies từ client gửi lên qua withCredentials
  const clientAccessToken = req.cookies?.accessToken

  if (!clientAccessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! Token not found'))
    return
  }

  try {
    //giải mã token
    const accessTokenDecoded = await tokenProvider.verifyToken(clientAccessToken, env.ACCESS_TOKEN_SECRET_SIGNATURE)
    //hợp lệ lưu vào req.jwtDecoded
    req.jwtDecoded = accessTokenDecoded
    //cho phép request xử lý tiếp
    next()
  } catch (error) {
    //nếu token hết hạn (Expired) trả mã lỗi 410 về FE để gọi api refreshToken
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Need to refreshToken'))
      return
    }
    // accessToken ko hợp lệ thì tả về 401
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized!'))
  }

}

export const authMiddleware = {
  isAuthorize
}