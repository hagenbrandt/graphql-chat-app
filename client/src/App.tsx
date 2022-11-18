import React from 'react'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { split, HttpLink } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { useState } from 'react'
import './App.css'
import Chats from './components/Chats'
import { SendMessage } from './components/SendMessage'
import env from "react-dotenv";

const wsLink = new WebSocketLink({
  uri: `ws://localhost:${env.API_PORT}/subscriptions`,
  options: {
    reconnect: true,
  },
})

const httpLink = new HttpLink({
  uri: `http://localhost:${env.API_PORT}/graphql`,
  credentials: 'include',
})

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query)

    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})

function App() {
  const [name, setName] = useState<string>('')
  const [entered, setEntered] = useState<boolean>(false)
  
  return (
    <ApolloProvider client={client}>
        {!entered && (
          <section>
          <form>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></input>
            <button onClick={() => setEntered(true)}>Enter chat</button>
          </form>
          </section>
        )}

        {name !== '' && entered && (
          <section>
            <h1>Default Chat Room</h1>
            <Chats user={name} />
            <SendMessage name={name} />
          </section>
        )}
    </ApolloProvider>
  )
}

export default App
