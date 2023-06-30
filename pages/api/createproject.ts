// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
//CREATE PROJECT
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

    //   Create new project
        const project = await prisma.project.create({
        data: {
            productModel,
            purchaseOrderCode,
            productName,
            orderQuantity,
            orderDate,
            projectStartDate,
            author: {
            connect: { id: authorId },
            },
        },
        include: {
            author: true,
            tasks: true,
        },
        });

        res.status(200).json(project);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
}
    