// server.js (or your main server file)

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


export default async function handler(req: any, res: any) {

  try {
    const {
      id,
    } = req.body;

    const deletedTask = await prisma.task.delete({
      where: {
        id: Number(id) 
     },

    });

    console.log('Task deleted successfully:', deletedTask);
    res.status(200).json({ message: 'Task deleted successfully.' });
  } 
  catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task.' });
  }
}


