const dotenv = require("dotenv").config()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { UserModel } = require("../models/UserModel")
const { BlackListModel } = require("../models/BlackListModel")

const userRouter = require("express").Router()

// Register Users
userRouter.post("/register", async(req, res)=>{
    const { name, email, password } = req.body
    try {
        let Email = await UserModel.findOne({email})
        if(Email ){
            res.send("Already Registered") 
        } else{
            if(isStrongPassword(password)){
                bcrypt.hash(password, 7, async(err, hash) =>{
                    if(err){
                        res.status(400).send("Error During Hashing Password")
                    } else{
                        let user = new UserModel({name, password: hash, email})
                        await user.save()
                        res.status(200).send("User Registered Successfully")
                    }
                })
            } else{
                res.send("Password does not meet criteria")
            }
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
})

// Login User
userRouter.post("/login", async(req, res)=>{
    const {email, password} = req.body
    try {
        let user = await UserModel.findOne({email})
        if(user){
            bcrypt.compare(password, user.password, (err, result)=>{
                if(err){
                    res.status(200).send("Incorrect Password")
                } else{
                    const Atoken = jwt.sign({userId: user._id, email: user.email}, process.env.AccessKey)
                    const Rtoken = jwt.sign({userId: user._id, email: user.email}, process.env.RefreshKey)
                    res.status(200).send({msg:"Login SuccessFully", AccessToken: Atoken, RefreshToken: Rtoken})
                }
            })
        } else{
            res.status(404).send('Not found')
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
})

//Refresh User Token
userRouter.get("/refresh", (req, res)=>{
    const Rtoken = req.headers.authorization?.split(" ")[1]
    if(Rtoken){
        jwt.verify(Rtoken, process.env.RefreshKey, (err, decoded)=>{
            if(err){
                res.status(400).json({message: "Session Expires"})
            } else{
                const Atoken = jwt.sign({userId: decoded.userId}, process.env.AccessKey)
                res.status(200).json({AccessToken: Atoken})
            }
        })
    } else{
        res.status(401).json({message:"Unauthorized User"})
    }
})

// Logout User
userRouter.get("/logout", async(req, res)=>{
    const token = req.headers.authorization?.split(" ")[1]
    try {
        const tokens = new BlackListModel({token: token, date: new Date()})
        await tokens.save()
        res.send("User logout Successfully")
    } catch (error) {
        res.send(error.message)
    }
})

module.exports = {userRouter}

// Check Strong Password

const isStrongPassword = (password) =>{
    const Lreg = /[a-z]/
    const Ureg = /[A-Z]/
    const Dreg = /\d/
    const Sreg = /[!@#$%&*_]/
    const Checklen = password.length >=8

    const isStrong = 
    Lreg.test(password) &&
    Ureg.test(password) &&
    Dreg.test(password) &&
    Sreg.test(password) &&
    Checklen

    return isStrong
}
