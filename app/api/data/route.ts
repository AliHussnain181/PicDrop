import { db } from "@/lib";
import { NextResponse } from "next/server";



export async function GET() {
    try {
      await db.$connect();
  
      const res = await db.images.findMany()
      
      return NextResponse.json(res)
      
    } catch (error) {
        return NextResponse.json(error)
    }
  }