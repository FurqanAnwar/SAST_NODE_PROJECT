import axios from 'axios';
import {login,signup,logout,forgotPassword,resetPassword,updatePassword} from './loginForm';
console.log("Hello from the client side");

// Get elements
const loginForm = document.getElementById("login-form");
const signUpForm = document.getElementById("signup-form");
const btnNavBar = document.getElementById("btn-navbar");
const resetPasswordBtn = document.getElementById("resetPassword-btn");
const updatePasswordBtn = document.getElementById("updatePassword-btn");
const submitBtnArr = document.querySelectorAll(".submit-btn");

const btnForgotPassword = document.getElementById("btn-forgotPassword");
const btnLogOut = document.querySelector(".btn-logout");

if(loginForm){
  console.log(loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
      console.log("Entered event listener")
      const email = document.getElementById('login-form-email').value;
      const password = document.getElementById('login-form-password').value;
      console.log("entering login function that is being imported");
      console.log(email, password)
      login(email, password);
   
  });
}

if(signUpForm){
    signUpForm.addEventListener('submit', e => {
        e.preventDefault();
    
          
        const userName = document.getElementById('signup-form-username').value;
        const email = document.getElementById('signup-form-email').value;
        const password = document.getElementById('signup-form-password').value;
        const confirmPassword = document.getElementById('signup-form-confirmPassword').value;

        signup(userName,email, password,confirmPassword);
       
      });
}

if(btnNavBar){
    btnNavBar.addEventListener("click",logout);
}

if(btnLogOut){
  console.log(btnLogOut)
  btnLogOut.addEventListener("click",logout);
}
if(btnForgotPassword){

  btnForgotPassword.addEventListener("click", e =>{
    
  e.preventDefault();
  const email = document.getElementById("email-forgotPassword").value;

  forgotPassword(email);
  })
}

if(resetPasswordBtn){
  resetPasswordBtn.addEventListener("click",(e) =>{
  e.preventDefault();
    let token = window.location.href.slice(36);
  
  const newPassword = document.getElementById("resetPassword-New").value;
  const confirmPassword = document.getElementById("resetPassword-Confirm").value;
    resetPassword(newPassword,confirmPassword,token);

  })
}

if(updatePasswordBtn){
  updatePasswordBtn.addEventListener("click", (e) =>{
    e.preventDefault();
    const currentPassword = document.getElementById("updatePassword-Current").value;
    const newPassword = document.getElementById("updatePassword-New").value;
    const confirmPassword = document.getElementById("updatePassword-Confirm").value;
    // console.table({currentPassword,newPassword,confirmPassword})
    updatePassword(currentPassword,newPassword,confirmPassword)
  })
}

if(submitBtnArr){
  console.log("Hello from questions view")
  let questionNo = window.location.pathname.slice(11);
  
  //make an axios get request
  let answers ;
    axios({
      method:"GET",
      url:"http://127.0.0.1:5000/user/questions-all"
    }).then( result => {
      answers = result.data.questions[questionNo];
      console.log(answers)
    }).catch(e => console.error(e))
    
  for(let btn of submitBtnArr){
    console.log("Entered Loop",answers)
    btn.addEventListener("click",(e) =>{
      //1: Get the ans and check if it's true
      const targetNode    = e.target;
      const parentNode =  targetNode.parentNode;
      const grandParentNode = parentNode.parentNode;

      const childs = grandParentNode.childNodes;
      // console.log(targetNode, parentNode, grandParentNode);
      console.log(childs)
      const question = childs[1];
      const ans = childs[2];
      console.log(question,ans)
      // console.log("WTF",ans,question);
      //2: If true disable the input and button and send result to server
      for(let val of answers){
      //  console.log(question.textContent)
        if(question.textContent === val.question && ans.value === val.answer){
          //make the input disabled along with button
         
          alert("You gussed it right 😃")
          // store ans along with ans and update user document
          ans.setAttribute("disabled","");
          targetNode.setAttribute("disabled","");
          // let obj = {
          //   question: question.textContent,
          //   answer: ans.value,
          //   disabled: true,
          //   points: 10
          // }
          //make an api call to update user document
          axios({
            method:"POST",
            url:"http://127.0.0.1:5000/user/updateMe",
            data: {
              question: question.textContent,
              answer: ans.value,
              disabled: true,
              points: 10
            }
            
          }).then( result => {
            console.log("User updated successfully");
          }).catch(e => console.error(e))
        }
        
      }
     
    })
  }
}

