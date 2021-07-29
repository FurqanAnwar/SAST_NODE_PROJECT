const jwt = require('jsonwebtoken');
const {promisify} = require('util');


const axios = require("axios");
exports.home = (req, res) =>{
    res.status(200).render("home",{
        heading: "This is home page heading section "
    })
}
exports.dashboard = async(req, res) =>{
    let questions = await axios({
        method:"GET",
        url:"http://127.0.0.1:5000/user/getAllUsers"
     })
     console.log(req.user);
    res.status(200).render("dashboard",{
        role: req.user.role,
        heading: "This is home page heading section ",
        activeUsers: questions.data.usersDoc.length
        
    })
}

exports.adminDashboard = async(req, res) =>{
    let users = await axios({
        method:"GET",
        url:"http://127.0.0.1:5000/user/getAllUsers"
     })
    res.status(200).render("adminDashboard",{
        heading: "This is admin dashboard heading ",
        Users: users.data
        
    })
}
exports.footer = (req, res) =>{
    res.status(200).render("footer",{
        heading: "This is home page heading section "
    })
}

exports.help = (req, res) =>{
    res.status(200).render("help",{
        heading: "This is help page heading section "
    })
}

exports.instructions = (req, res) =>{
    res.status(200).render("instructions",{
        heading: "This is help page heading section "
    })
}

exports.moreTasks = (req, res) =>{
    res.status(200).render("moreTasks",{
        heading: "This is help page heading section "
    })
}
exports.updatePassword = (req, res) =>{
    res.status(200).render("updatePassword",{
        heading: "This is help page heading section "
    })
}
exports.navbar = (req, res) =>{
    res.status(200).render("navbar",{
        heading: "This is home page heading section "
    })
}
// exports.navbarOriginal = (req, res) =>{
//     res.status(200).render("navbarOriginal",{
//         heading: "This is home page heading section "
//     })
// }
// exports.navbar2 = (req, res) =>{
//     res.status(200).render("navbar2",{
//         heading: "This is home page heading section "
//     })
// }
exports.signup = (req, res) =>{
    res.status(200).render("signUp",{
        title: "SignUp"
    })
}
exports.questions = async(req, res) =>{
    //Get the questions and pass them to template
    // console.log(req.params) 
     let questions = await axios({
        method:"GET",
        url:"http://127.0.0.1:5000/user/questions-all"
     })
     // obj.field
     //obj["fieldName"]
     // req.param = "q1"
     //questions.data.questions = {q1,q2}
     //questions.data.questions = ["q1"]
     let questionsArr = questions.data.questions[req.params.questionNo];
     console.log("This is the request",questionsArr);
     let token = req.cookies.jwt;
    const decodedString = await promisify(jwt.verify)(token,process.env.JWT_SECRET)
     console.log(decodedString)
     let user = await axios({
         method: "POST",
         url: "http://127.0.0.1:5000/user/getUser",
         data:{
            id : decodedString.id
         }
     })
    //  console.log(user.data.user.ansArr);
     let ansArr = user.data.user.ansArr;
    res.status(200).render("questions",{
        title: "questions",
        questionsArr,
        ansArr
    })
}

exports.signin = (req, res) =>{
    res.status(200).render("signIn",{
        title: "Sign In "
    })
}


exports.forgotPassword = (req, res) =>{
    res.status(200).render("forgotPassword",{
        title: "Forgot Password "
    })
}
exports.resetPassword = (req, res) =>{
    console.log("Hello from view")
    console.log(req.params)
    res.status(200).render("resetPassword",{
        title: "reset Password "
    })
}