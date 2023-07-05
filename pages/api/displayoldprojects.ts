// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// export default async function displayOldProjectHandler(req: any, res: any) {
//   try {
//     const { productModel, purchaseOrderCode } = req.query;

//     const projects = await prisma.project.findMany({
//       where: {
//         projectId: number,
//       },
//       include: {
//         author: true,
//         tasks: true,
//       },
//     });

//     if (!projects || projects.length === 0) {
//       return res.status(404).json({ error: 'No projects found' });
//     }

//     res.status(200).json(projects);
//   } catch (error) {
//     console.error('Error retrieving projects:', error);
//     res.status(500).json({ error: 'Failed to retrieve projects' });
//   }
// }
