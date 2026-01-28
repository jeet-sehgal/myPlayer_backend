import dotenv from "dotenv"
dotenv.config("./.env")
import {app} from "./app.js"
import {dbConnection} from "./db/index.js"

dbConnection()
.then(()=>{
    app.listen(process.env.PORT||8080,()=>{
        console.log(`the server is running on ${process.env.PORT||8080}`)
    })
})
.catch(e=>{
    console.log("error in db ",e)
})