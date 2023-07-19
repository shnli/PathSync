import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  try {
    const projectCount = await prisma.project.count();

    res.status(200).json({ count: projectCount });
  } catch (error) {
    console.error('Error retrieving project count:', error);
    res.status(500).json({ error: 'Failed to retrieve project count' });
  }
}