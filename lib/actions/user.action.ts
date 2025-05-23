"use server";


import { connectDatabase } from "../db/dbcheck";
import { prisma } from "@/lib/db/client";


export async function getUserById(params: any){
    try {
        await connectDatabase()
        const {userId} = params
        const user = await prisma.user.findUnique({
            where: {
                clerkId: userId
            }
        })
        return user
    } catch (error) {
        console.log(error)
    }
}


