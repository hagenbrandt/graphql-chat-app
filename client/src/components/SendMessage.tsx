import React, {useState} from 'react'
import {gql, useMutation} from '@apollo/client'

const SEND_MESSAGE = gql`
    mutation createChat($name: String!, $message: String!) {
        createChat(name: $name, message: $message) {
            id
            name
            message
        }
    }
`;

type SendMessageProps = {
    name: string
}

export const SendMessage = ({name}: SendMessageProps) => {
    const [input, setInput] = useState<string>('')
    const [sendMessage, { data }] = useMutation(SEND_MESSAGE)

    const handleSend = () => {
        sendMessage({ variables: { name: name, message: input } }).then((data) => {
            console.log(data);
            setInput('')
        }).catch(console.error)
    }

    return (
        <div>
            <input type="text" id='message' value={input} onChange={(event) => setInput(event.currentTarget.value)} />
            <button onClick={handleSend}>Send Message</button>
        </div>
    )
}