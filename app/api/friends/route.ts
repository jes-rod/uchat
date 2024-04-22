
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import getSession from "@/app/actions/getSession";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(
  request: Request
) {
  try{
    const body = await request.json();
    const session = await getSession();
    const {
      data
    } = body;
    const email = data.email;
    const exists = await prisma.user.findUnique({
      where: {
        email: data.email
      }
    })

    if(exists){
      const user = await getCurrentUser();
      if(!user?.contacts.includes(email)){
        await prisma.user.update({
          data: {
            contacts: {
                  push: email
              }
          },
          where: {
              email: session?.user?.email as string
          }
        });
        return NextResponse.json('Contact added successfully');
      }
      return new NextResponse('You already added this user as a contact', { status: 500 });

    }
    
    else{
      return new NextResponse('This user has not created an account with us yet', { status: 500 });
    }
    

  }catch (error) {
    return new NextResponse(error as string, { status: 500 });
  }



}
