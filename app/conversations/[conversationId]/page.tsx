import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";

import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";
import EmptyState from "@/app/components/EmptyState";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getContacts from "@/app/actions/getContacts";
import { GroupAdditions, User } from "@prisma/client";
import getGroupAddition from "@/app/actions/getGroupAddition";

interface IParams {
  conversationId: string;
}

const ChatId = async ({ params }: { params: IParams }) => {
  const conversation = await getConversationById(params.conversationId);
  const messages = await getMessages(params.conversationId);
  const currentUser: User = await getCurrentUser() as User;
  const contacts = await getContacts();
  let groupAddition;
  if(conversation?.isGroup){
    groupAddition = await getGroupAddition(params.conversationId) as GroupAdditions;
  }
  

  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    )
  }

  return ( 
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col bg-blue-950/50">
        <Header conversation={conversation as any} contacts={contacts as User[]} currentUser={currentUser as User} />
        <Body initialMessages={messages} groupAddition={groupAddition as GroupAdditions} />
        <Form conversation={conversation} currentUser={currentUser as User}/>
      </div>
    </div>
  );
}

export default ChatId;