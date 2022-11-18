import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client'

const SEND_MESSAGE = gql`
  mutation createChat($name: String!, $message: String!) {
    createChat(name: $name, message: $message) {
      id
      name
      message
    }
  }
`

type SendMessageProps = {
  name: string
}

export const SendMessage = ({ name }: SendMessageProps) => {
  const [input, setInput] = useState<string>('')
  const [sendMessage, { data }] = useMutation(SEND_MESSAGE)

  const handleSend = () => {
    sendMessage({ variables: { name: name, message: input } })
      .then((data) => {
        console.log(data)
        setInput('')
      })
      .catch(console.error)
  }

  return (
    <form>
      <textarea
        name="message"
        id="message"
        cols={30}
        rows={6}
        onChange={(event) => setInput(event.currentTarget.value)}
      ></textarea>
      <br />
      <button type="button" onClick={handleSend}>
        Send Message
      </button>
    </form>
  )
}
