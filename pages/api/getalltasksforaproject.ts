import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  try {
    const { id } = req.query; // Get the project ID from the request query parameters

    const tasks = await prisma.task.findMany({
      where: {
        projectId: Number(id), // Filter tasks based on the project ID
      },
      include: {
        project: true, // Include the associated project information
      },
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error retrieving tasks:', error);
    res.status(500).json({ error: 'Failed to retrieve tasks' });
  }
}