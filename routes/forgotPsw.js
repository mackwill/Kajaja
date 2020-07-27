const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt')
const database = require('../database')

module.exports = (db) => {

  //Get forgot password form
  router.get('/forgot-password', (req, res) => {
    res.render('forgot_page')
  })


  router.post('/forgot-password', (req, res) => {
    database.getUserWithEmail(req.body.email)
    .then(user => {
      if(user){
        user.resetToken = generateRandomString(7)
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
          html: `<p>Hi, to reset your password click on the following link: <a href="${req.protocol}://${req.get('host')}/reset?token=${user.resetToken}">Reset your password</a></p>`
        }
        transporter.sendMail(mailOptions, (error, info) => {
          if(error){
            return console.log(error)
          }
          console.log('Message %s sent: %s', info.messageId, info.response)
        })
      }
      res.render('forgot-page', {message: 'Reset email sent'})

    })
  })

  router.get('/reset', (req, res) => {
    req.session.reset = req.query.token
    res.redirect('/reset-password')
  })

  router.get('/reset-password', (req, res) => {
    const user = getUserByResetToken(req.session.reset, users)
    const templateVars = new TemplateVars()
    if(!user){
    templateVars.hasMessage('Error...')
    }else{
      req.session.userId = user.id;
    }
    res.render('reset_password', templateVars)
  })

  router.post('/change-password', (req, res) => {
    if(req.session.reset && req.session.userId){
      const cryptedPassword = bcrypt.hashSync(req.body.password, 10)
      database.updateUserPasswordByUserId(req.session.userId, cryptedPassword)
      then(user => res.redirect('/api/users/login'))
      .catch((e) => res.redirect('/api.users/login'))
    }
    req.session.reset = null
    res.redirect('/api/users/login')
  })


  return router;
};
