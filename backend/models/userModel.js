const mongoose = require('mongoose')
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter ur name"],
        maxLength:[30,"Name cannot exceed 30 charecters"],
        minLength:[4,"Nmae should have more than 5 charecters"]
    },
    email:{
        type:String,
        required:[true,"Please Enter Your Email"],
        unique:true,
        validate:[validator.isEmail,"Please Enter a Valid Email"]
    },
    password:{
        type:String,
        required:[true,"please Enter Password"],
        minLength:[8,"Password Should be min 8 charecters"],
        select:false
    },
    avatar:{
        public_id: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken : String,
    resetPasswordExpire : Date
})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password,10);
})

// JWTToken
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
}

//comapre Password
userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password)
}

module.exports = mongoose.model("User",userSchema)
