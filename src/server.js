import express from 'express'
import cors from 'cors'
import exitHook from 'exit-hook'
import { CONNECT_DB, GET_DB, CLOSE_DB } from '~/config/mongodb.js'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddlewares.js'
import { corsOptions } from './config/cors'
import cookieParser from 'cookie-parser'
import socketIo from 'socket.io'
import http from 'http'
import { inviteUserToBoardSocket } from './sockets/inviteUserToBoardSocket'


const startServer = () => {
  const app = express()
  app.use((req, res, next ) => {
    res.set('Cache-Control', 'no-store')
    next()
  })
  //cookieParser
  app.use(cookieParser())
  //enable cors
  app.use(cors(corsOptions))
  //endable parsing json data in request body
  app.use( express.json() )
  app.use('/v1', APIs_V1)

  //middleware xu ly loi tap trung
  app.use( errorHandlingMiddleware )

  // tao server moi de boc app express de lam realtime
  const server = http.createServer(app)
  const io = socketIo(server, { cors: corsOptions })
  io.on('connection', (socket) => {
    inviteUserToBoardSocket(socket)
  })

  if (env.BUILD_MODE === 'production') {
    server.listen(process.env.PORT, () => {
      console.log(`Hello ${ env.AUTHOR }, I am running at ${ process.env.PORT }/`)
    })
  }
  else {
    server.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      console.log(`Local Dev Hello ${ env.AUTHOR }, I am running at ${ env.LOCAL_DEV_APP_HOST }:${ env.LOCAL_DEV_APP_PORT }/`)
    })
  }

  exitHook( () => {
    CLOSE_DB()
  })
}

( async () => {
  try {
    console.log('Connecting to MongoDB...')
    await CONNECT_DB()
    console.log('MongoDB connected successfully!')
    startServer()
  }
  catch (err) {
    console.error('Error connecting to MongoDB:', err)
    process.exit(1)
  }
})()