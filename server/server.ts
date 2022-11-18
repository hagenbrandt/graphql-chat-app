import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import dotenv from 'dotenv'
import cors from 'cors'
import http from 'http'
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { ChatResolver } from './src/resolvers/chat'

dotenv.config()

const app = express()
const httpServer = http.createServer(app)

app.use(cors({ origin: `http://localhost:3000`, credentials: true }))

export const start = async () => {
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ChatResolver],
      validate: false,
    }),
    subscriptions: {
      path: '/subscriptions',
      onConnect: () => {
        console.log('Client connected for subscriptions')
      },
      onDisconnect: () => {
        console.log('Client disconnected from subscriptions')
      },
    },
  })

  apolloServer.applyMiddleware({
    app,
    cors: false,
  })
  apolloServer.installSubscriptionHandlers(httpServer)

  httpServer.listen(process.env.PORT, () => {
    console.log(
      `Server listen on port http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
    )
    console.log(
      `Subscriptions ready at ws://localhost:${process.env.PORT}${apolloServer.subscriptionsPath}`
    )
  })
}
