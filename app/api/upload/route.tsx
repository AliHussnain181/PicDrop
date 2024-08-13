import { NextResponse } from 'next/server';
import { db, UploadCloudinary } from '@/lib';
import { writeFile } from 'fs/promises';



export async function POST(req: Request) {
  try {
    await db.$connect();

    const data = (await req.formData()).get('file') as File;

    if (!data) {
      return NextResponse.json({ error: 'File is missing' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await data.arrayBuffer());

    const uint8ArrayBuffer = new Uint8Array(fileBuffer);
    // Write the file to a temporary location
    const tempFilePath = `./public/${data.name}`;

    await writeFile(tempFilePath, uint8ArrayBuffer);

    const resp = await UploadCloudinary(tempFilePath);

    if (!resp?.url) {
      throw new Error('Failed to upload image to Cloudinary');
    }

    const imgSave = await db.images.create({
      data: {
        imgurl: resp.url,
      },
    });

    return NextResponse.json({ success: true,message:"image saved successfully" ,data: imgSave });
  } catch (error) {
    console.error('Error occurred while processing the request:', error);
    return NextResponse.json((error as Error)?.message, { status: 500 });
  } finally {
    await db.$disconnect();
  }
}




export async function PUT(req: Request) {
  try {

    const formData = await req.formData();

    const imgId = formData.get('id') as string;
    const data = formData.get('file') as File;

    if (!imgId) {
      return NextResponse.json({ error: 'Image ID is missing' }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({ error: 'File is missing' }, { status: 400 });
    }

    await db.$connect();

    const checkImage = await db.images.findUnique({
      where: {
        id: imgId,
      },
    });

    console.log(checkImage?.imgurl);
    

    if (!checkImage) {
      NextResponse.json({success:false,message:"in your account this image not found"})
    }

    
    const fileBuffer = Buffer.from(await data.arrayBuffer());

    const uint8ArrayBuffer = new Uint8Array(fileBuffer);
    // Write the file to a temporary location
    const tempFilePath = `./public/${data.name}`;

    await writeFile(tempFilePath, uint8ArrayBuffer);

    const resp = await UploadCloudinary(tempFilePath);

    if (!resp?.url) {
      throw new Error('Failed to upload image to Cloudinary');
    }

    const imgSave = await db.images.update({
      where:{
        id:imgId
      },
      data:{
        imgurl:resp?.url
      }
    })

    return NextResponse.json({ success: true,message:"image update successfully" ,data: imgSave });
    
  } catch (error) {
    console.error('Error occurred while processing the request:', error);
    return NextResponse.json((error as Error)?.message, { status: 500 });
  }
}