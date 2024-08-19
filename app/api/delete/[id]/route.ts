import { db, deleteCloudinaryImage, getPublicIdFromUrl } from "@/lib";

export async function DELETE(req: Request) {
  // Extract the ID from the URL
  const picId = req.url.split("/api/delete/")[1];

  if (!picId) {
    return new Response("Invalid ID", { status: 400 });
  }

  try {
    await db.$connect();

    const { imgurl } = await db.images.delete({
      where: {
        id: picId,
      },
    });
    const publicId = getPublicIdFromUrl(imgurl);

    if (publicId) {
      await deleteCloudinaryImage(publicId);
    } else {
      // Handle the case where the publicId could not be extracted
      console.error("Failed to extract public ID from the URL");
      return new Response("Failed to extract public ID from the URL", {
        status: 400,
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: "your pic is deleted" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting image:", error);
    return new Response("Failed to delete image", { status: 500 });
  } finally {
    await db.$disconnect();
  }
}
