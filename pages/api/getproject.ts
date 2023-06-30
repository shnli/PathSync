import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  try {
    const {
      productModel,
      purchaseOrderCode,
      productName,
      orderQuantity,
      orderDate,
      projectStartDate,
      authorId,
    } = req.body;

    const projects = await prisma.project.findMany({
      where: {
        productModel,
        purchaseOrderCode,
        authorId,
      },
      include: {
        author: true,
        tasks: true,
      },
    });

    if (projects.length === 0) {
      return res.status(404).json({ error: 'No projects found' });
    }

    res.status(200).json(projects);
  } catch (error) {
    console.error('Error retrieving projects:', error);
    res.status(500).json({ error: 'Failed to retrieve projects' });
  }
}
