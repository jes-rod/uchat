import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

interface IParams {
  userId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json(null);
    }

    const deletedUser = await prisma.user.delete({
      where: {
        id: currentUser.id
      },
    });


    return NextResponse.json(deletedUser)
  } catch (error) {
    console.log(error);
    return new NextResponse(error as BodyInit, { status: 500 });;
  }
}
