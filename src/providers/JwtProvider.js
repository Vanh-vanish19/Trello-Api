import JWT from 'jsonwebtoken'

const generateToken = async (userInfo, secretSignature, tokenLife) => {
  try {
    return JWT.sign(userInfo, secretSignature, { algorithm: 'HS256', expiresIn: tokenLife })
  } catch (error) {throw Error(error)}
}

const verifyToken = async (token, secretSignature) => {
  try {
    return JWT.verify(token, secretSignature)
  } catch (error) {throw Error(error)}
}

export const tokenProvider = {
  generateToken,
  verifyToken
}