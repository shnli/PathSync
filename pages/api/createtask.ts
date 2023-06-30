// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
//CREATE TASK
export default async function handler(req: any, res: any) {
  console.log("hello")
  try {
    const {
      step,
      startCheck,
      finishCheck,
      task,
      lead,
      duration,
      expectedStart,
      expectedFinish,
      start,
      finish,
      remarks,
      projectId, 
      executingSide,
    } = req.body;
    
    const createdTask = await prisma.task.create({
      data: {
        step,
        startCheck,
        finishCheck,
        task,
        lead,
        duration,
        expectedStart,
        expectedFinish,
        start,
        finish,
        remarks,
        executingSide,
        project: {
          connect: { id: projectId },
        },
      },
    });
    
    res.status(200).json(createdTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
}
