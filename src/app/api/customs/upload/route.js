import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_SECRET_KEY,
});

export async function POST(req, res) {
  try {
    // Parse the incoming request body
    const { files, folder } = await req.json(); // Expecting an array of files and a folder

    if (!files || !Array.isArray(files) || files.length === 0 || !folder) {
      return new Response(JSON.stringify({ error: "No files or folder provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Process each file and upload it to Cloudinary
    const uploadResponses = await Promise.all(
      files.map(async (file, index) => {
        const publicId = `/${folder}/image_${Date.now()}_${index}`; // Generate unique public IDs for each file

        const uploadResponse = await cloudinary.uploader.upload(file, {
          public_id: publicId, // Use unique public ID
          overwrite: true,
          folder: folder, // Specify the folder in Cloudinary
        });

        return {
          publicId: uploadResponse.public_id,
          url: uploadResponse.secure_url,
        };
      })
    );

    // Respond with the URLs of all uploaded images
    return new Response(
      JSON.stringify({
        message: "Images uploaded successfully",
        images: uploadResponses, // Contains publicId and URL for each uploaded image
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to upload images" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}


// Add DELETE handler for deleting an image
export async function DELETE(req, res) {
  try {
    const { publicId } = await req.json(); // Expecting the publicId of the image to delete
    console.log(publicId)

    if (!publicId) {
      return new Response(
        JSON.stringify({ error: "No publicId provided" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const deleteResponse = await cloudinary.uploader.destroy(publicId);

    if (deleteResponse.result === "ok") {
      return new Response(
        JSON.stringify({ message: "Image deleted successfully" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ error: "Failed to delete image" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete image" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}