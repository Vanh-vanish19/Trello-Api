/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 * eslint-disable-next-line no-console
 */
import express from 'express'
import exitHook from 'exit-hook'
import { CONNECT_DB, GET_DB, CLOSE_DB } from '~/config/mongodb.js'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'

const startServer = () => {
  const app = express()
  app.use( express.json())
  app.use('/v1', APIs_V1)
  const hostname = env.APP_HOST
  const port = env.APP_PORT

  app.get('/', (req, res) => {
    // Test Absolute import mapOrder
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.listen(port, hostname, () => {
    console.log(`Hello ${ env.AUTHOR }, I am running at ${ hostname }:${ port }/`)
  })

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
    console.error(err)
    process.exit(0)
  }
})()
// CONNECT_DB()
//   .then(() => { console.log('Connected to MongoDB') })
//   .then(() => { startServer() })
//   .catch(err => {
//     console.error(err)
//     process.exit(0)
//   })