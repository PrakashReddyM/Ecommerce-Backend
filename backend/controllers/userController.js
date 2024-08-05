const User = require("../models/userModel")
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncError = require("../middlewares/catchAsyncError")
const sendToken = require("../utils/jwtToken")

// register a user
exports.registerUser = catchAsyncError(async(req,res,next)=>{
    req.body.user = req.user.id;
    const {name,email,password} = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:"sample id",
            url:"sample url"
        }
    })
    sendToken(user,201,res)
})

// Login User
exports.LoginUser = catchAsyncError(async(req,res,next)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email And Password",400))
    }
    const user = await User.findOne({email}).select("+password")
    if(!user){
        return next(new ErrorHandler("Invalid Email or Password",401))
    }
    const isPasswordMatched = await user.comparePassword(password)
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid password",401))
    } 
    sendToken(user,200,res)
})

// Logout User
exports.logoutUser = catchAsyncError(async(req,res,next)=>{
    res.cookie('token',null,{
        httpOnly:true,
        expires:new Date(Date.now())
    })
    res.status(200).json({
        success:true,
        message:"Loggod Out"
    })
})

// Get User Details
exports.getUserDetails = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success:true,
        user
    })
})

// update User Password
exports.updatePassword = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password")
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)
    if(!isPasswordMatched){
        return next(new ErrorHandler("Oldpassword is Incorrect",400))
    } 
    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("password doesnt match",400))
    }
    user.password = req.body.newPassword
    await user.save()
    sendToken(user,200,res)
})

// update User Profile
exports.updateProfile = catchAsyncError(async(req,res,next)=>{
    const newUserData = {
        name:req.body.name,
        email:req.body.email
    }
    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:true
    })
    res.status(200).json({
        success:true,
        user
    })
})

// Get all Users -admin
exports.getAllUsers = catchAsyncError(async(req,res,next)=>{
    const users  = await User.find()
    res.status(200).json({
        success:true,
        users
    })
})

// Get single User -admin
exports.getSingleUser = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.params.id)
    if(!user){
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`,400))
    }
    res.status(200).json({
        success:true,
        user
    })
})

// Update User role -admin
exports.updateUserRole = catchAsyncError(async(req,res,next)=>{
    const newUserData = {
        // name:req.body.name,
        // email:req.body.email,
        role:req.body.role
    }
    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:true
    })
    res.status(200).json({
        success:true,
        user
    })
})

// Delete User -Admin
exports.deleteUser = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.params.id)
    if(!user){
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400))
    }
    await user.deleteOne()
    res.status(200).json({
        success:true,
        message:"User Deleted Successfully"
    })
})