import mongoose from "mongoose";

type connectionObject={
  isConnected?:number   // ? means optional
}

const connection:connectionObject={};

async function dbConnect():Promise<void>{ // void != c++ void. it means return type unknown
  if(connection.isConnected){
    console.log("Already connected to database");
    return;
  }
  // console.log(mongoose.modelNames())
  try {
    const db=await mongoose.connect(process.env.MONGODB_URI || '',{});
    
    connection.isConnected=db.connections[0].readyState;
    console.log("DB connected successfully");
    
  } catch (error) {
    console.log("DB connection failed",error);
    process.exit(1);
    
  }
}

export default dbConnect;