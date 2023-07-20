import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  const { userId } = req.query;

  try {
    if (!userId) {
      res.status(400).json({ error: 'User ID not provided' });
      return;
    }

    const projectCount = await prisma.project.count({
      where: {
        authorId: parseInt(userId),
      },
    });

    res.status(200).json({ count: projectCount });
  } catch (error) {
    console.error('Error retrieving project count:', error);
    res.status(500).json({ error: 'Failed to retrieve project count' });
  }
}
