import { db } from "@/lib"; // Ensure this points to your actual database connection file
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Connect to the database
    await db.$connect();

    // Extract the picId from the URL
    const picId =  req.url.split("/api/open/")[1];

    // Check if picId is valid
    if (!picId) {
      return new Response("Invalid ID", { status: 400 });
    }

    // Log the picId to the console
    // console.log("picId:", picId);

    // Query the database for the image with the given picId
    const res = await db.images.findUnique({
      where: {
        id: picId,
      },
    });

    // If the image is not found, return a 404 response
    if (!res) {
      return new Response("Image not found", { status: 404 });
    }

    // Return the found image as JSON
    return NextResponse.json(res);
  } catch (error) {
    // Log the error for debugging
    console.error("Error:", error);

    // Return the error as a JSON response
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  } finally {
    // Ensure that the database connection is closed
    await db.$disconnect();
  }
}
