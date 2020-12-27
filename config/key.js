const clientID = process.env.GOOGLE_CLIENT_ID

const clientSecret = process.env.GOOGLE_CLIENT_SECRET

const senderEmail = process.env.SENDER_EMAIL

const accountActivationSecret = process.env.ACCOUNT_ACTIVATION_SECRET;

const host = process.env.HOST_ADDRESS;

const resetPasswordSecret = process.env.RESET_PASSWORD_SECRET
module.exports ={
    clientID,
    clientSecret,
    senderEmail,
    accountActivationSecret,
    host,
    resetPasswordSecret
}