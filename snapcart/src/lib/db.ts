import { connect } from "mongoose"

let mongodbUrl= process.env.MONGODB_URL
if(!mongodbUrl){
    throw new Error("mongodb url is not found")
}

let cached= global.mongoose                     //global.mongoose declayer in globle.d.ts

if(!cached){
    cached=global.mongoose={
      conn:null,
      promise:null
    }
}

const connectDB=async ()=>{
  // ✅ reuse connection
  if(cached.conn){
    // console.log("Cached DB Connected")
    return cached.conn
  }

  // ✅ create new connection
  if(!cached.promise){
    cached.promise = connect(mongodbUrl).then((c)=>c.connection)
  }

  try {
    cached.conn=await cached.promise
    // console.log("DB Connected")
  } catch (error) {
    cached.promise = null;
    throw error
  }

  return cached.conn
}

export default connectDB
