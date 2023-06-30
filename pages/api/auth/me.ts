import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(401).json({ message: 'Data Not Provided' });
    return;
  }

  const user = await prisma.user.findMany({
    where: {
      email: email,
      password: password,
    },
  });

  if (user.length === 0) {
    res.status(401).json({ message: 'User not found' });
    return;
  }

  // Assuming the user object contains all the user data you want to return
  const userData = user[0];

  res.status(200).json(userData);
}
