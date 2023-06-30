// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
//CREATE TASK
export default async function handler(req: any, res: any) {
  try {
    const {
      id,
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
      projectId, 
    } = req.body;
    

    const updatedTasks = await prisma.task.update({
      where: {
        // id: 1,
        id: Number(id)
        // id: task.id,
      },
      data: {
        step: step,
        startCheck: startCheck,
        finishCheck: finishCheck,
        task: task,
        lead: lead,
        duration: duration,
        expectedStart: expectedStart,
        expectedFinish: expectedFinish,
        start: start,
        finish: finish,
        remarks: remarks,
        executingSide: executingSide,
        project: {
          connect: { id: projectId },
        },
      },
      include: {
        project: true,
      },
    });    
    console.log("hello")
    res.status(200).json(updatedTasks);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
}

