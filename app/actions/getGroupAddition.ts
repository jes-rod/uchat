import prisma from "@/app/libs/prismadb";
import getSession from "./getSession";

const getGroupAddition = async (conversationId: string) => {
  const session = await getSession();

  if (!session?.user?.email) {
    return [];
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    });
    const groupAddition = await prisma.groupAdditions.findUnique({
        where: {
            userId_conversationId: {
              userId: user?.id as string,
              conversationId: conversationId as string
            }
          }
    });
    return groupAddition;
  } catch (error: any) {
    return [];
  }
};

export default getGroupAddition;
