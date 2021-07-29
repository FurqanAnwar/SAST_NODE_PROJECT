
import axios from 'axios';

 export const login = async (email, password) => {
    try {
      const res = await axios({
        method: 'POST',
        url: 'http://127.0.0.1:5000/user/signin',
        data: {
          email,
          password
        }
      });
      if (res.data.status === 'success') {
        alert('Logged in successfully!');
        
        window.setTimeout(() => {
          location.assign('/dashboard');
        }, 1500);
      }
    } catch (err) {
      alert(err.response.data.message);
    }
  };

 export const signup = async (userName,email, password, confirmPassword) => {
    try {
      const res = await axios({
        method: 'POST',
        url: 'http://127.0.0.1:5000/user/signup',
        data: {
          userName,
          email,
          password,
          confirmPassword
        }
      });
      if (res.data.status === 'success') {
        alert('signup is successful');
        window.setTimeout(() => {
          location.assign('/signin');
        }, 1500);
      }
    } catch (err) {
      alert(err.response.data.message);
    }
  };

export const logout = async() =>{
  try{
    
    const res = await axios({
    method:'GET',
    url:'http://127.0.0.1:5000/user/logout'
  });
  if (res.data.status === 'success') {
     location.assign("/signin");
    
  }
} catch (err) {
  alert(err.response.data.message);
}
}


export const forgotPassword = async (email)=>{

  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:5000/user/forgotPassword',
      data: {
        email
      }
    });

    if (res.data.status === 'success') {
      alert('Recovery Email Sent Successfully!');
      
    }
  } catch (err) {
    alert(err.response.data.message);
  }
};

export const resetPassword = async (password,confirmPassword,token) => {
  
  let url = `http://127.0.0.1:5000/user/resetPassword/${token}`;
   try {
     console.log("entered try block")
     const res = await axios({
       method: 'PATCH',
       url,
       data: {
         password,
         confirmPassword
       }
     });

     if (res.data.status === 'success') {
       alert('Password Reset successfully!');
       window.setTimeout(() => {
         location.assign('/signin');
       }, 1500);
     }
   } catch (err) {
     console.log(err.response.data)
     alert(err.response.data.message);
   }
 };

 export const updatePassword = async (passwordCurrent,password,confirmPassword) => {
  
  console.table(passwordCurrent,password,confirmPassword)
   try {

    const res = await axios({
       method: 'PATCH',
       url: 'http://127.0.0.1:5000/user/updatePassword',
       data: {
         passwordCurrent,
         password,
         confirmPassword
       }
     });

     if (res.data.status === 'success') {
       alert('Password Updated successfully!');
       window.setTimeout(() => {
         location.assign('/signin');
       }, 1500);
     }
   } catch (err) {
     console.log(err.response.data)
     alert(err.response.data.message);
   }
 };

