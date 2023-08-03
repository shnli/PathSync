// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
// //CREATE project
// export default async function handler(req: any, res: any) {
//   try {
//     const {
//       id,
//       step,
//       startCheck,
//       finishCheck,
//       project,
//       lead,
//       duration,
//       expectedStart,
//       expectedFinish,
//       start,
//       finish,
//       remarks,
//       executingSide,
//       projectId, 
//     } = req.body;
    

//     const updatedprojects = await prisma.project.update({
//       where: {
//         // id: 1,
//         id: Number(id)
//         // id: project.id,
//       },
//       data: {
//         step: step,
//         startCheck: startCheck,
//         finishCheck: finishCheck,
//         project: project,
//         lead: lead,
//         duration: duration,
//         expectedStart: expectedStart,
//         expectedFinish: expectedFinish,
//         start: start,
//         finish: finish,
//         remarks: remarks,
//         executingSide: executingSide,
//         project: {
//           connect: { id: projectId },
//         },
//       },
//       include: {
//         project: true,
//       },
//     });    
//     console.log("hello")
//     res.status(200).json(updatedprojects);
//   } catch (error) {
//     console.error('Error creating project:', error);
//     res.status(500).json({ error: 'Failed to create project' });
//   }
// }

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
//CREATE TASK
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
    
      status,
      authorId,
      remarks
      
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
      
        status: status,
        remarks: remarks,

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

