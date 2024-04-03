import prisma from "../db";

export const getAll = async (userId: string) => {
  try {
    const pockets = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        Pocket: {
          include: {
            pocketTransactions: true,
            target: true,
          },
        },
      },
    });
    return { data: pockets };
  } catch (error) {
    console.error(error);
    return { error };
  }
};

export const getOne = async (userId: string, pocketId: string) => {
  try {
    const pocket = await prisma.pocket.findUnique({
      where: {
        id: pocketId,
        userId: userId,
      },
      include: {
        pocketTransactions: true,
        target: true,
      },
    });
    return { data: pocket };
  } catch (error) {
    console.error(error);
    return { error };
  }
};
