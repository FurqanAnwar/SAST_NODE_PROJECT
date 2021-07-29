const AppError = require("../utils/appError");

const handleJWTError = (err) =>  new AppError("Invalid token , please login again",401);
const handleExpiredToken = (err) => new AppError("Your token is expired, please logi in again", 401);
const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
  };
  
  const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    console.log(value);
  
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
  };
  
  const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
  
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
  };
  
const sendDevError = (res, err) => {
    // res.status(err.statusCode).render("error",{
    //    title: "Something went wrong",
    //    message: err.message
    // });
    // console.log(err.errors.properties);
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}

const sendProdError = (res, err) =>{
    //If our error is operational than send it else send friendly message
    if(err.isOperational){

        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            alert: "This is global error handling middleware"
        });
    }else{
        res.status(500).json({
            status: 500,
            message: "Something went wrong"
        });
    }
}


module.exports = (err,req, res, next) =>{
    err.statusCode = err.statusCode || 500;
    err.status     = err.status || 'fail';
    // console.log("Entered Global Error Handling")
    console.log(process.env.NODE_ENV);

    if(process.env.NODE_ENV === 'development'){
        
        sendDevError(res,err);
    }else if(process.env.NODE_ENV === 'production'){
        let error = {...err};
        // error.message = err.message;
        if(error.name === "JsonWebTokenError") error = handleJWTError(error);
        if(error.name === "TokenExpiredError") error = handleExpiredToken(error);
        
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
  
        sendProdError(res,error);
    }
        console.log(err);
}