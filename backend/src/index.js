const express = require("express")
const dotenv = require("dotenv").config()
const swaggerjsdoc = require("swagger-jsdoc")
const swaggerui = require("swagger-ui-express")
const cors = require("cors")

const { connection } = require("./configs/db")
const { userRouter } = require("./routes/userRoute")
const { productRouter } = require("./routes/ProductRoute")
const { newProductRouter } = require("./routes/newProductRoute")
const { auth } = require("./middlewares/auth.middleware")

const app = express()
const PORT = process.env.PORT

// Middlewares
app.use(cors({origin: "*"}))

// Routes
app.use("/users", userRouter)
app.use("/products", productRouter)
app.use("/newproducts",auth, newProductRouter)

// Swagger Docs
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "BlueFly Shopping Site",
            version: "1.0.0"
        },
        servers: [{url:"http://localhost:8080"}]
    },
    apis: ["src/routes/*.js"]
}
//Open API Specs
const openAPISpecs = swaggerjsdoc(options)
// Build the Swagger with help of openAPI
app.use("/docs", swaggerui.serve, swaggerui.setup(openAPISpecs))

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