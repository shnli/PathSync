
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
//UPDATE PROJECT
export default async function handler(req: any, res: any) {
  try {
    const {
      id,
      productModel,
      purchaseOrderCode,
      productName,
      orderQuantity,
      orderDate,
      projectStartDate,
      authorId,
      
    } = req.body;
    

    const updatedProjects = await prisma.project.update({
      where: {        id: Number(id)
      },
      data: {

        productModel: productModel,
        purchaseOrderCode: purchaseOrderCode,
        productName: productName,
        orderQuantity: orderQuantity,
        orderDate: orderDate,
        projectStartDate: projectStartDate,

        author: {
            connect: { id: authorId },
        },
      },
      include: {
        author: true,
      },
    });    
    console.log("hello")
    res.status(200).json(updatedProjects);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
}

