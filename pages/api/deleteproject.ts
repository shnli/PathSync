const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  try {
    const { id } = req.body;

    const deletedProject = await prisma.project.delete({
      where: {
        id: Number(id),
      },
      include: {
        author: true,
        tasks: true,
      },
    });

    console.log('project deleted successfully:', deletedProject);
    res.status(200).json({ message: 'Project deleted successfully.' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project.' });
  }
}
