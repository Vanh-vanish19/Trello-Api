/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */


const MONGODB_URI = 'mongodb+srv://vanishadmin:W8njoin6KTOHJO3X@clustervanish.gmoqtvc.mongodb.net/?retryWrites=true&w=majority&appName=ClusterVanish'

const DB_NAME = 'trello-vanish'

import { MongoClient, ServerApiVersion } from 'mongodb'

let trelloDBInstance = null

const clientInstance = new MongoClient( MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  await clientInstance.connect()
  trelloDBInstance = clientInstance.db( DB_NAME )
}

export const GET_DB = () => {
  if ( !trelloDBInstance ) throw new Error( 'MongoDB is not connected yet!' )
  return trelloDBInstance
}

export const CLOSE_DB = async () => {
  await clientInstance.close()
}