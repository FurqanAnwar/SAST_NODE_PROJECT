const express = require('express');
const dotenv  = require('dotenv');
// const pug     = require('pug');
const path  = require('path');
const cookieParser  = require('cookie-parser');
const mongoose  = require('mongoose');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
// const catchAsync = require('./utils/catchAsync');
// const User = require('./models/userModel');
const userRoute = require('./routes/userRoute');
const viewRoute = require('./routes/viewRoute');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'pug');
app.set('views',path.join(__dirname, 'views'));

// serving static files
app.use(express.static(path.join(__dirname, 'public')));

const DB = process.env.MONGO_URI.replace('<password>', process.env.PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology:true
}).then( res =>{
    console.log(`Successfully connected to ${res.connections[0].name} DB and host is ${res.connections[0].host}`);
}).catch( err =>{
    console.error(err.name, err.message);
})


app.use((req,res,next) =>{
    req.requestedTime = new Date(Date.now);
    next();
})

// View route
app.use('/', viewRoute);
// User route
app.use('/user',userRoute); 


app.all('*', (req, res,next) =>{
    
              next(new AppError(`This ${req.originalUrl} route hasn't been implemented yet`,404));
})

app.use(globalErrorHandler)

const PORT   = process.env.PORT;
const server = app.listen(PORT, () =>{
    console.log(`Server is running on port ${process.env.PORT}`);
});

process.on("unhandledRejection",err =>{
    console.log("Unhandled Rejection caught 💥");
    console.log(err.name,err.message);
    server.close(() =>{
        process.exit(1);
    })
})

process.on("uncaughtException", err =>{
    console.log("UncaughtException Caught 💥");
    console.log(err.name, err.message);
    server.close(() =>{
        process.exit(1);
    });
})
