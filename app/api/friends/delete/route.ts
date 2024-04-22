import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

export async function POST(
  request: Request,
  
) {

  try {
    const body = await request.json();
    const {
      user
    } = body;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json(null);
    }

    const contacts = await prisma.user.findUnique({
      where: {
        email: currentUser.email as string
      },
      select: {
        contacts: true
      }
    });

    if (!contacts) {
      return new NextResponse('Invalid user', { status: 400 });
    }

    await prisma.user.update({
      where: {
        email: currentUser.email as string,
      },
      data: {
        contacts: {
          set: contacts.contacts.filter((contact: any) => contact !== user.email )
        }
      }
    });

    return NextResponse.json('Contact deleted successfully')
  } catch (error) {
    return new NextResponse('Something went wrong', { status: 500 });
  }
}