import { gql, useQuery } from '@apollo/client'
import { useEffect } from 'react'

type Chat = {
  id: number
  message: string
  name: string
  __typename: string
}

const ALL_CHATS = gql`
  query allChats {
    getChats {
      id
      name
      message
    }
  }
`

const CHATS_SUBSCRIPTION = gql`
  subscription OnNewChat {
    messageSent {
      id
      name
      message
    }
  }
`

const Chats = ({ user }: { user: string }) => {
  const { loading, error, data, subscribeToMore } = useQuery(ALL_CHATS)

  useEffect(() => {
    subscribeToMore({
      document: CHATS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const newChat = subscriptionData.data.messageSent

        return {
          getChats: [...prev.getChats, newChat],
        }
      },
    })
  }, [subscribeToMore])

  if (loading) return <p>"Loading...";</p>
  if (error) return <p>`Error! ${error.message}`</p>

  const date = new Date()
  console.log(data)

  return (
    <div className="chat-area">
      {data.getChats.map((chat: Chat, index: number) => {
        console.log('Is User', chat.name === user)
        const className =
          chat.name === user ? 'message user-message' : 'message'

        return (
          <p key={chat.id} className={className}>
            <time>{`${date.getHours()} : ${date.getMinutes()}`}</time>
            <br />
            {chat.name}: {chat.message}
          </p>
        )
      })}
    </div>
  )
}

export default Chats
