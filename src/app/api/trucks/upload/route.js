import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_SECRET_KEY,
});

export async function POST(req, res) {
  try {
    // Parse the incoming request body
    const { file, imageName, folder } = await req.json(); // Expecting the file and imageName

    if (!file || !imageName || !folder) {
      return new Response(JSON.stringify({ error: "No file or imageName provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Define the public ID for the image (this ensures the image is replaced if it exists)
    const publicId = `/${folder}/${imageName}`; // You can customize the public ID to include a folder and name

    // Upload the file to Cloudinary, replacing the existing image with the same public ID
    const uploadResponse = await cloudinary.uploader.upload(file, {
      public_id: publicId, // Use the same public ID to replace the image
      overwrite: true, // Ensure the image is overwritten if it already exists
      folder: "trucks", // Optional: specify the folder name in Cloudinary
    });

    // Respond with the uploaded image URL
    return new Response(
      JSON.stringify({
        message: "Image uploaded successfully",
        url: uploadResponse.secure_url,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to upload image" }),
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