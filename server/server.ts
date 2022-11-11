import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { buildSchema } from 'type-graphql'
import cors from 'cors'
import dotenv from 'dotenv'
import { ChatResolver } from './src/resolvers/chat'

dotenv.config()

const app = express()

app.use(cors({ origin: `http://localhost:8080`, credentials: true }))

export const start = async () => {
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ChatResolver],
      validate: false,
    }),
  })

  apolloServer.applyMiddleware({
    app,
    cors: false,
  })

  // export const start = () => {
  app.listen(process.env.PORT, () => {
    console.log(
      `Server listen on port ${process.env.PORT} - ${apolloServer.graphqlPath}`
    )
  })
}
