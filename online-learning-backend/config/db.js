import mongoose from "mongoose";

const connectDB = async() =>{
    try{
        const conn = await mongoose.connect("mongodb+srv://popbhanu:admin12340@cluster2.aciw9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2");
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch(error){
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;