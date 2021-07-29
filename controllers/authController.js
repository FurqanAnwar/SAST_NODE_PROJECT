const crypto = require('crypto');
const {promisify} = require('util');
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const User = require('./../models/userModel');
const Answers = require('./../models/answerModel');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');
const CatchAsync = require('./../utils/catchAsync');
const { create } = require('./../models/userModel');

const signToken = id =>{
return jwt.sign({id}, process.env.JWT_SECRET,{
    expiresIn: process.env.JWT_EXPIRES_IN
})
}

const createAndSendToken = (user, statusCode, res) =>{
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    if(process.env.NODE_ENV === "production") cookieOptions.secure = true
    res.cookie("jwt",token,cookieOptions);
    
    res.status(statusCode).json({
        status: "success",
        token
    })
}
exports.signup = catchAsync(async(req, res, next) =>{
    
    const user = await User.create({
        userName: req.body.userName,
        email   : req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    });

    createAndSendToken(user,201,res);
});

exports.signin = catchAsync(async (req, res,next) =>{
    //Get the user based on provided email and password
        const {email, password} = req.body;
               
        if(!email || !password){
            return next( new appError("Please provide email and password", 400));
        }
    //Check if user exists and password is correct
        const user = await User.findOne({email}).select('+password');
        
    // based on password compare the password with db password 

        if(!user || !(await user.correctPassword(password,user.password))){
            return next(new appError("Incorrect Email or Password",401));
        }
    //If everything is ok send back token
   createAndSendToken(user,200,res);
})

exports.protect = catchAsync(async (req, res,next) =>{
    let token;
    //1 : Get Token and check if it's valid
        
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(" ")[1];
        
         }else if (req.cookies.jwt) {
            token = req.cookies.jwt;
          }
        

        if(!token){
        return next(new AppError("You are not logged in , Please login to get access",401))
    }
    //2 : Verification Token
        
            const decodedString = await promisify(jwt.verify)(token,process.env.JWT_SECRET)
    //3 : Check if user still exists

        const currentUser = await User.findById(decodedString.id);
        if(!currentUser){
            return next(new AppError("User belonging to this token no longer exists", 401));
        }

    //4 : Check if user changed their password after token was issued
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
})

//Only for rendered pages
exports.isLoggedIn = async (req, res,next) =>{
   
    if(req.cookies.jwt){
        try{
    //2 : Verification Token
        
    const decodedString = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET)
    //3 : Check if user still exists

        const currentUser = await User.findById(decodedString.id);
        if(!currentUser){
            return next();
        }

    //4 : Check if user changed their password after token was issued
    res.locals.user = currentUser;
    return next();

    }catch(err){
        return next();
    }
    }
    next();
}

exports.restrictTo = (role) =>{
    return (req, res,next) =>{
    // Check user role if it exists 
    console.log(req.user.role)
    if(role != req.user.role){
        return next(new AppError("You don't have the permission to perform this action", 403))
    }
    //Everything sorted Than call next
    next();
}};
exports.getAllUsers = catchAsync(async (req, res,next) =>{
    res.status(200).json({
        status: "success",
        data  : [{User: 1},{User: 2}]
    });
})

exports.forgotPassword = catchAsync( async(req, res, next) =>{
    // Get user based on provided email address
    // console.log(req.body);
        const user = await User.findOne({email: req.body.email});

        if(!user){
            return next(new AppError("There is no user with this email address",404))
        }
    // Generate a random token
        const token = user.getPasswordResetToken();
        await user.save({
            validateBeforeSave: false
        })
    // Send generated token to user
    const resetUrl = `${req.protocol}://${req.get('host')}/resetPassword/${token}`;
    const message = `Forgot your password submit a PATCH request with your new password
    and confirm password to ${resetUrl}.\n If you didn't forgot your password please ignore
    this message`;
        try{
    await sendEmail({
        email: user.email,
        subject: "Your password reset token",
        message 
    })}
    catch(err){
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        user.save({
            validateBeforeSave: false
        });
        return next(new AppError("There was a problem sending Email, Please try again",500));
    }
    res.status(200).json({
        status: "success",
        token: token
    })
})

exports.resetPassword = async(req, res,next) =>{
    // console.log(req.params.token);
    console.log(req.params.token)
    // get user based on token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({passwordResetToken: hashedToken,passwordResetExpires:{
        $gt: Date.now()
    }});

    if(!user){
        return next(new AppError("Token is invalid or expired", 404));
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // log user in and send token
    createAndSendToken(user,200,res);
    
}
 
exports.updatePassword = CatchAsync(async(req, res, next) =>{

    //1: Get the user from the collection
            const user = await User.findById(req.user.id).select('+password');
            
    //2: Check if POSTed password is correct
        if(! (await user.correctPassword(req.body.passwordCurrent, user.password))){
            return next(new AppError("Your current password is wrong", 401))
        }
       
    //3: If so update the password
        user.password = req.body.password;
        user.confirmPassword = req.body.confirmPassword;
        await user.save();
    //4: Log the user in, send token
    createAndSendToken(user, 200, res);
});

exports.modifyUser = catchAsync(async(req, res, next) =>{
    
        // Get the user from DB    
        const user = await User.findOne({email: req.user.email});

        //Modify the ans section of user
        user.ans ={q1 : req.body.ans1,
            q2 : req.body.ans2,
            q3 : req.body.ans3,
            q4 : req.body.ans4,
            q5 : req.body.ans5};
        // Save the changes

       user.save({
           validateBeforeSave: false
       }).then( result =>{
           console.log("User document saved");
           console.log(result)
       })

    // Send back ok response
    res.status(200).json({
        status: "success",
        body: {
            result: "You have modified the answers document"
        }
    })
});


exports.logout = catchAsync((req, res,next) =>{
    res.cookie("jwt","ThisISBUllSHit",{
        expiresIn: new Date(Date.now + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({
        status: "success",
        message: "Successfully logged out of your account"
    })
})
exports.questionsAll = (req, res,next) =>{
    
    res.status(200).json({
        status: "success",
        questions:{
            q1:[{
            "question" : "on what port is the app running on?",
            "answer"   : "10001"
            },
            {
            "question" : "-x in the curl command stands for?",
            "answer"   : "proxy"
            },
            {
            "question" : "-X has how many arguments?",
            "answer"   : "2"
            },
            {
            "question" : "register using curl -X POST http://localhost:10001/register -H 'Content-Type: application/json' --data '{'name':'bob', 'email':'bob@example.com', 'password':'bobisboss'}'and by replacing name and email with $ne what did you got?",
            "answer"   : "testing1@gmail.com"
            },{
            "question" : "what if you want to greater then in the question 4 command what will you write?",
            "answer"   : "$gt"
            }
            ],
            q2:[
            {
            "question" : "Nothing",
            "answer"   : "Null"
            }
            ]
            
            
            }
    })
}

exports.updateMe = async(req, res,next) =>{
    // Get data from request
    const obj = req.body;
    console.log(obj)
    // Check if user exists
    const user = await User.findOne({email: req.user.email});
    if(!user){
        return next(new AppError("This user doesn't exist", 404))
    }
    // If true update user document
    user.ansArr.push(obj);
    let points = user.gotPoints;
    user.gotPoints = points + obj.points;
    user.taskCompleted = user.taskCompleted + 1;
    user.save({
        validateBeforeSave: false
    });
    console.log(user);

    res.status(200).json({
        status: "success",
        body:{
            user
        }
    })
}

exports.getUser = async(req, res,next) =>{
console.log(req.body.id)
    const user = await User.findById({
        _id: req.body.id
    });

    if(!user){
        return next(new AppError("User does not exists", 404))
    }

    res.status(200).json({
        status: "success",
        user
    })
}

exports.getAllUsers = async(req, res,next) =>{
    // console.log(req.body.id)
        const usersDoc = await User.find({});
        console.log(usersDoc)
        if(!usersDoc){
            return next(new AppError("There are no users", 404))
        }
    
        res.status(200).json({
            status: "success",
            usersDoc
        })
    }