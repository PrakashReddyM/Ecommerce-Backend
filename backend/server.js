const app = require("./app")
const dotenv = require('dotenv')
const connectDB = require("./config/database")

// Handling Uncaught exception
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`)
    console.log("Shutting down the server due to uncaught exception")
    process.exit(1)
})

//config
dotenv.config({path:"backend/config/config.env"})

// connecting Database
connectDB()

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is working on PORT: http://localhost:${process.env.PORT}`)
})

// unhandled promise rejection
process.on("unhandledRejection",(err)=>{
    console.log(`Error: ${err.message}`)
    console.log(`Shutting Down the server due to unhandled Promise Rejection`)
    server.close(()=>{
        processexit(1)
    })
})