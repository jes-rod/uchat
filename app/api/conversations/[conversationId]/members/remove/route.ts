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
      userId
    } = body;
    const currentUser = await getCurrentUser();
    const date = new Date();

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

    const updatedConversation = await prisma.conversation.update({
      data:{
        userIds: {
          set: existingConversation.userIds.filter((existingUserId: any) => userId !== existingUserId )
        }
      },
      where: {
        id: conversationId
      }

    });

    const updatedGroupAddition = await prisma.groupAdditions.update({
      data: {
        dateRemoved: date
      },
      where: {
        userId_conversationId: {
          userId: userId,
          conversationId: conversationId as string
        }
      }
    })


    existingConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, 'conversation:update', existingConversation);
      }
    });

    return NextResponse.json(updatedConversation)
  } catch (error) {
    return new NextResponse(error as any, { status: 500 });
  }
}

