import {
  Mutation,
  Query,
  Subscription,
  Resolver,
  Arg,
  Root,
  PubSub,
  PubSubEngine,
} from 'type-graphql'
import { Chat } from '../entities/Chat'

const chats: Chat[] = []
const channel = 'CHAT_CHANNEL'

@Resolver()
export class ChatResolver {
  @Query(() => [Chat])
  getChats(): Chat[] {
    return chats
  }

  @Mutation(() => Chat)
  async createChat(
    @Arg('name') name: string,
    @Arg('message') message: string,
    @PubSub() PubSub: PubSubEngine
  ): Promise<Chat> {
    const chat = { id: chats.length + 1, name, message }
    chats.push(chat)
    const paylaod = chat
    await PubSub.publish(channel, paylaod)

    return chat
  }
  @Subscription({ topics: channel })
  messageSent(@Root() { id, name, message }: Chat): Chat {
    return { id, name, message }
  }
}
