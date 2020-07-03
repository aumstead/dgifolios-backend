const User = require("../models/User");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sesTransport = require("nodemailer-ses-transport");
require("dotenv").config();
const bcrypt = require('bcryptjs')

exports.forgot = async (req, res, next) => {
  const { email } = req.body;

  const smtpTransporter = nodemailer.createTransport({
    port: 465,
    host: "email-smtp.us-east-1.amazonaws.com",
    secure: true,
    auth: {
      user: process.env.AWS_ACCESS_KEY_ID,
      pass: process.env.AWS_SECRET_ACCESS_KEY,
    },
    debug: true,
  });

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      crypto.randomBytes(32, (err, buffer) => {
        if (err) {
          console.error(err);
          return res.status(403).send("Error creating token");
        }
        const token = buffer.toString("hex");
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        user
          .save()
          .then(() => {
            smtpTransporter.sendMail(
              {
                to: email,
                from: "dgifolios@gmail.com",
                subject: "Reset password",
                html: `<p>You've requested an email to reset your password. You can change your password by using the following link.</p></br>https://dgifolios.com/reset/${token}`,
              },
              () => {
                // perhaps here send a message to display in UI
                res.status(200).json(`Email sent to ${email} with reset password link.`);
              }
            );
          })
          .catch((error) => {
            console.error(error)
            res.status(500).send("Database error.")
          });
      });
      
    } else {
      res
        .status(404)
        .send(
          "Sorry, but there doesn't seem to be an account associated with that email address."
        );
    }
  } catch (error) {
    res.status(403).send("Error in try/catch");
  }
};

exports.reset = (req, res, next) => {
  const { password, token } = req.body;
  let resetUser;

  function validatePassword(inputtxt) {
    var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,20}$/;
    if (inputtxt.match(passw)) {
      return true;
    } else {
      return false;
    }
  }

  if (!validatePassword(password)) {
    return res.status(422).send("Password must be between 7-20 characters, contain a number, one uppercase letter, and one lowercase letter.")
  }

  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      resetUser = user
      return bcrypt.hash(password, 10);
    })
    .then((hash) => {
      resetUser.password = hash;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save()
    })
    .then(result => {
      res.status(200).send("Password reset successful.")
    })
    .catch((error) => {
      console.error(error);
      res.status(403).send("Password reset unsuccessful. Try requesting another reset email or contact us at admin@dgifolios.com.")
    });
};
