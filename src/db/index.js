import mongoose from "mongoose"

export const dbConnection =async()=>{
    try{
        await mongoose.connect(`${process.env.DB_URI}${process.env.DB_NAME}`)
        
    }
    catch(e){
        console.log("error in db connection : ",e)
    }
}