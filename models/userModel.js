const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const crypto = require('crypto');
const {Schema} = mongoose;

const userSchema = new Schema({
    userName: {
        required: [true, "User Must Have A Name"],
        type: String,

    },
    email:{
        type: String,
        required: [true, "User Must Provide An Email Address"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password:{
        type: String,
        required: [true, "User Must Provide A Password"],
        minlength: [8, "A password should have a minimum length of 8 characters"],
        select: false
    },
    confirmPassword:{
        type: String,
        required: true,
        validate: {
            validator: function(el){
                return el === this.password
            },
            message: "Passwords are not the same!"
        },
       
    },
    role:{
        type:String,
        default: 'user'
    },
    ansArr: Array,
    presentRank: {
        type: Number,
        default: 0
    },
    taskCompleted: {
        type: Number,
        default: 0
    },
    gotPoints:{
        type: Number,
        default: 0
    },

    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date
});

userSchema.pre('save', async function(next){
        if(!this.isModified('password')) return next();

        this.password = await bcrypt.hash(this.password, 16);
        this.confirmPassword = undefined;
        next();
})
userSchema.pre('save', function(next){
    if(!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
})
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
}


userSchema.methods.getPasswordResetToken = function(){
    const token = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    console.log({token}, this.passwordResetToken);
    return token;
}


const User = mongoose.model('User', userSchema);

module.exports = User;