import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
  conversationId?: string;
}

export async function POST(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { conversationId } = params;
    const body = await request.json();
    const {
      members
    } = body;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json(null);
    }

    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId
      },
      include: {
        users: true
      }
    });

    
    if (!existingConversation) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    members.forEach(async (member: any) => {
      await prisma.conversation.update({
        data:{
          userIds: {
            push: member.value
          }
        },
        where: {
          id: conversationId
        },
  
      });

      const existingGroupAddition = await prisma.groupAdditions.findUnique({
        where:{
          userId_conversationId: {
            userId: member.value,
            conversationId: conversationId as string
          }
        }
      })

      if(existingGroupAddition){
        await prisma.groupAdditions.delete({
          where:{
            userId_conversationId: {
              userId: member.value,
              conversationId: conversationId as string
            }
          }
        });
      }
      await prisma.groupAdditions.create({
        data: {
          userId: member.value as string,
          conversationId: conversationId as string
        }
      })
    })

    existingConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, 'conversation:update', existingConversation);
      }
    });

    return NextResponse.json('Members added successfully')
    
  } catch (error) {
    return NextResponse.json(null);
  }
}

