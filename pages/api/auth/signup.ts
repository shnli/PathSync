// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

//this is a post request 

export default async function handler(req:any, res:any) {
//handle data here

//api call unpacks the data collected from axios
    const email = req.body.email
    const password = req.body.password

    if (!email || !password){
      res.status(401).json({ message : 'Data Not Provided' })
    }

//uses prisma to create task itsself
    const user = await prisma.user.create({
      data: {
        email: email,
        password: password
      }
    }) 
    
    res.status(200).json({ message : 'User Created' })

}
  
