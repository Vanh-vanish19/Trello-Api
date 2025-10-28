import express from 'express'
import exitHook from 'exit-hook'
import { CONNECT_DB, GET_DB, CLOSE_DB } from '~/config/mongodb.js'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddlewares.js'
const startServer = () => {
  const app = express()
  //endable parsing json data in request body
  app.use( express.json() )
  app.use('/v1', APIs_V1)

  //middleware xu ly loi tap trung
  app.use( errorHandlingMiddleware )

  app.get('/', (req, res) => {
    // Test Absolute import mapOrder
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Hello ${ env.AUTHOR }, I am running at ${ env.APP_HOST }:${ env.APP_PORT }/`)
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