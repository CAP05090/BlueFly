const express = require("express")
const dotenv = require("dotenv").config()
const cors = require("cors")

const { connection } = require("./configs/db")

const app = express()
const PORT = process.env.PORT

app.use(cors({origin: "*"}))

// Home Page
app.get("/", (req, res)=>{
    res.status(200).send("Welcome to home page")
})

app.listen(PORT, async()=>{
    try {
        await connection
        console.log(`Express is running on port ${PORT} and DB is connected`)
    } catch (error) {
        console.log(error.message)
    }
})