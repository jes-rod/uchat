import prisma from "@/app/libs/prismadb";
import getSession from "./getSession";

const getContacts = async () => {
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
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      where: {
          email: {in: user?.contacts }
      }
    });

    return users;
  } catch (error: any) {
    return [];
  }
};

export default getContacts;
