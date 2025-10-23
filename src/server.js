/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 * eslint-disable-next-line no-console
 */
import express from 'express'
import exitHook from 'exit-hook'
import { CONNECT_DB, GET_DB, CLOSE_DB } from '~/config/mongodb.js'

const startServer = () => {
  const app = express()

  const hostname = 'localhost'
  const port = 8017

  app.get('/', (req, res) => {
    // Test Absolute import mapOrder
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.listen(port, hostname, () => {
    console.log(`Hello Vanish, I am running at ${ hostname }:${ port }/`)
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