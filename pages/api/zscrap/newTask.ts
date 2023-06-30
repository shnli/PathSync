// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req:any, res:any) {
//handle data here

// //api call unpacks the data collected from axios
//     console.log(req.body)
//     const title = req.body.title
//     const description = req.body.description

// //uses prisma to create task itsself
//     const task = await prisma.task.create({
//       data: {
//         title: title,
//         description: description
//       }
//     }) 
//     res.status(200).json({ name: 'John Doe' })


}
  
