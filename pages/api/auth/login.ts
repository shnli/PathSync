import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req:any, res:any) {
  const { email, password } = req.body; // Retrieve email and password from the request body

  if (!email || !password) {
    res.status(401).json({ message: 'Data Not Provided' });
    return;
  }

  const user = await prisma.user.findMany({
    where: {
      email: email,
      password: password
    }
  });

  console.log(user);

  if (user.length === 0) {
    res.status(401).json({ message: 'User not found, Please Try Again' });
    return;
  }

  res.status(200).json({ message: 'User found' });
}
