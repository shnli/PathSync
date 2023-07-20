// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export default async function handler(req: any, res: any) {
//   try {
//     const projects = await prisma.project.findMany({
//       include: {
//         author: true,
//         tasks: true,
//       },
//     });

//     res.status(200).json(projects);
//   } catch (error) {
//     console.error('Error retrieving projects:', error);
//     res.status(500).json({ error: 'Failed to retrieve projects' });
//   }
// }

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID not provided' });
    }

    const projects = await prisma.project.findMany({
      where: {
        authorId: Number(userId), // Assuming 'authorId' is the field representing the user ID in the 'project' table
      },
      include: {
        author: true,
        tasks: true,
      },
    });

    res.status(200).json(projects);
  } catch (error) {
    console.error('Error retrieving projects:', error);
    res.status(500).json({ error: 'Failed to retrieve projects' });
  }
}
