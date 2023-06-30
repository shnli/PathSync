// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req:any, res:any) {

    //uses prisma to send task back to front
    const tasks = await prisma.task.findMany()
    console.log(tasks)

    res.status(200).json({ tasks })


}
  
