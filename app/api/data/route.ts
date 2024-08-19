import { db } from "@/lib";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // Create a new URL object to parse query parameters
  const url = new URL(req.url);
  
  // Get query parameters and set default values if they are not provided
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);
  
  // Calculate the offset
  const offset = (page - 1) * limit;

  try {
    // Fetch images with pagination
    const res = await db.images.findMany({
      skip: offset,
      take: limit,
    });
    // Return the result as a JSON response
    return NextResponse.json(res);
  } catch (error) {
    // Handle any errors and return a 500 status
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
