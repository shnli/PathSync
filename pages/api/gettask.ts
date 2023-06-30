import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Next.js API route handler
export default async function handler(req: any, res: any) {
  try {
    const { id } = req.query;

    const task = await prisma.task.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error('Error retrieving task:', error);
    res.status(500).json({ error: 'Failed to retrieve task' });
  }
}
