/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment'

let trelloDBInstance = null

const clientInstance = new MongoClient( env.MONGDODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  await clientInstance.connect()
  console.log('MongoDB connected !')
  trelloDBInstance = clientInstance.db( env.DATABASE_NAME )
}

export const GET_DB = () => {
  if ( !trelloDBInstance ) throw new Error( 'MongoDB is not connected yet!' )
  return trelloDBInstance
}

export const CLOSE_DB = async () => {
  await clientInstance.close()
}