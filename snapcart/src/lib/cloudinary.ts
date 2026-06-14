import { v2 as cloudinary } from 'cloudinary';             

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
 });

 const uploadOnCloudinary = async (file : Blob | null):Promise<string | null> => {
    
    if(!file){
        return null;
    }

    try {
        const arrayBuffer=await file.arrayBuffer()
        const buffer=Buffer.from(arrayBuffer)
        return new Promise((resolve,reject)=>{
          const uploadStream=cloudinary.uploader.upload_stream(
            {
                resource_type:"auto",
                folder:"grocery"
            },
            (error,result)=>{
                if(error) reject(error)
                else resolve(result?.secure_url ?? null)
            }
          )
          uploadStream.end(buffer)
        })
    } catch (error) {
        console.log(error);
        return null;
    }

 }
 
 export {uploadOnCloudinary}





// <-------------------Notes----------------------->
//  🧠 Line-by-line explanation

// 1️⃣ Import Cloudinary
// import { v2 as cloudinary } from 'cloudinary';

// Imports Cloudinary SDK
// v2 = modern API version
// Renamed to cloudinary for easier use

// 2️⃣ Configure Cloudinary
// cloudinary.config({ 
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//   api_key: process.env.CLOUDINARY_API_KEY, 
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// Sets credentials using environment variables
// Required for authentication
// These values come from your Cloudinary dashboard

// 3️⃣ Function declaration
// const uploadOnCloudinary = async (file: Blob | null): Promise<string | null>

// Async function to upload a file
// Accepts:
// Blob (file from formData)
// or null
// Returns:
// string → uploaded image URL
// null → if upload fails

// 4️⃣ Null check
// if (!file) {
//   return null;
// }

// Prevents errors if no file is provided

// 5️⃣ Convert file → ArrayBuffer
// const arrayBuffer = await file.arrayBuffer()

// Converts file into raw binary data
// Needed for processing in Node.js

// 6️⃣ Convert ArrayBuffer → Buffer
// const buffer = Buffer.from(arrayBuffer)

// Converts to Node.js Buffer
// Cloudinary stream expects Buffer data

// 7️⃣ Create Promise for upload
// return new Promise((resolve, reject) => {

// Wraps callback-based Cloudinary API into Promise
// Allows await usage

// 8️⃣ Upload using stream
// const uploadStream = cloudinary.uploader.upload_stream(

// Starts upload stream
// Best method for Next.js (no multer needed)

// 9️⃣ Upload options
// {
//   resource_type: "auto",
//   folder: "grocery"
// }

// resource_type: "auto" → auto-detect file type
// folder → organize uploads in Cloudinary dashboard

// 🔟 Handle upload result
// (error, result) => {
//   if (error) reject(error)
//   else resolve(result?.secure_url ?? null)
// }

// Callback runs after upload
// If error → reject Promise
// If success → return:

// result.secure_url

// 👉 This is your final image URL

// 1️⃣1️⃣ Send buffer to stream
// uploadStream.end(buffer)

// Pushes file data into Cloudinary upload stream
// Starts the upload process

// 1️⃣2️⃣ Catch block
// } catch (error) {
//   console.log(error);
//   return null;
// }

// Handles unexpected errors
// Logs error
// Returns null safely

// 1️⃣3️⃣ Export function
// export { uploadOnCloudinary }

// Makes function reusable in API routes


// 🧠 Interview answer
// I use Cloudinary’s upload_stream method to upload files in Next.js by converting the file into a buffer. This avoids multer and works efficiently with the Web API request object.