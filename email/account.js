const {senderEmail,host} = require('../config/key')

const welcomeEmail = (to,token) => {
   return {
        from:senderEmail,
        to,
        text: `Welcome from Idea App. Please Click the link to activate 
        your account <a href="${host}/auth/activate/${token}">Activate Account</a>`,
        subject: 'Welcome to IdeaApp',
        html: `<h3>Welcome from Idea App.</h3> Please Click the link to activate 
        your account <a href="${host}/auth/activate/${token}">Activate Account</a>`
    
   }
}
const accountDeleteEmail = (to) => {
    return {
         from:senderEmail,
         to,
         text: 'Delete Your Account',
         subject: 'Sorry to see you go',
         html: '<p> Delete Your Account </p>'
     
    }
 }

 const passwordResetEmail = (to,token) => {
     return {
          from:senderEmail,
          to,
          subject: 'Account Reset',
          text: `You requested to reset Password. Please Click the link to reset password 
          <a href="${host}/auth/reset-password/${token}">Reset Password</a>`,
          html: `<p>You requested to reset Password. Please Click the link to reset password 
          <a href="${host}/auth/reset-password/${token}">Reset Password</a></p>`
      
     }
  }

module.exports={
    welcomeEmail,
    accountDeleteEmail,
    passwordResetEmail
}