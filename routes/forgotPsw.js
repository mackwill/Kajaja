const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt')
const database = require('../database')
const nodeMailer = require('nodemailer')
const dotenv = require('dotenv');
dotenv.config()
const helper = require("../helper");


module.exports = (db) => {

  //Get forgot password form
  router.get('/forgot-password', (req, res) => {
    const templateVars = {user:null, message:null}
    res.render('forgot_page', templateVars)
  })

  //Submit your email to receive reset email
  router.post('/forgot-password', (req, res) => {
    console.log('first step:',req.body)
    database.getUserWithEmail(req.body.email)
    .then(user => {
      if(user){
        const resetToken = helper.generateRandomString(7)

        database.updateUserTokenById(user.id, resetToken)
        .then(user => {
          let transporter = nodeMailer.createTransport({
            host:'smtp.gmail.com',
            port:465,
            secure:true,
            auth:{
              user:process.env.USERMAIL,
              pass: process.env.USERPASS
            }
          })
          let mailOptions = {
            to: req.body.email,
            subject: 'Reset your password for Kajaja',
            html: `<p>Hi, to reset your password click on the following link: <a href="${req.protocol}://${req.get('host')}/api/mailer/reset?token=${resetToken}">Reset your password</a></p>`
          }
          transporter.sendMail(mailOptions, (error, info) => {
            if(error){
              return console.log('message wasnt sent:',error)
            }
            console.log('Message %s sent: %s', info.messageId, info.response)
          })
          res.render('forgot_page', {message: 'Reset email sent'})

        })
        .catch((e) => {

          res.render('forgot_page', {message: 'Reset email wasnt sent'})

        })


      }else{
      res.render('forgot_page', {message: 'Reset email wasnt sent'})
      }
    })
    .catch((e) => {
      console.log('db request didnt worked send:', e)
      res.redirect('/')
    })
  })

  //Validate the cookie from the email clicked
  router.get('/reset', (req, res) => {
    req.session.reset = req.query.token
    res.redirect('/api/mailer/reset-password')
  })

  //Get form to update the password
  router.get('/reset-password', (req, res) => {
    database.getUserByResetToken(req.session.reset)
    .then(user => {
      console.log(user)
      req.session.reset = user.id
      res.redirect('/api/mailer/change-password')
    })
    .catch((e) => {
      res.redirect('/')
    })
  })

  //Get form to update the password
  router.get('/change-password', (req, res) => {
    res.render('reset_password')
  })

  //Update the users password
  router.post('/change-password', (req, res) => {
      const cryptedPassword = bcrypt.hashSync(req.body.password, 10)

    database.updateUserPasswordByUserId(req.session.reset, cryptedPassword)
      .then(user => {
        req.session = null
        res.redirect('/api/users/login')
      })
      .catch((e) => {
        req.session = null
        res.redirect('/api.users/login')
      })
  })


  return router;
};
