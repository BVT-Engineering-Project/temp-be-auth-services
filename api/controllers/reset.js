const userServices = require("../services/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const getCurrentDate = require("../helper/currentDate");
const nodemailer = require("nodemailer");
const currentDate = getCurrentDate();
const handlebars = require("nodemailer-express-handlebars");
const path = require("path");
class ResetControllers {
  //Request Reset Password
  static async requestForgotPassword(req, res, next) {
    try {
      if (!req.body.email_username || req.body.email_username == "") {
        return res.status(400).json({
          status_code: 400,
          message: `email not allowed null or empty!`,
          data: null,
          request: {
            url: "users/reset/request-forgot-password",
          },
        });
      }
      const user = await userServices.checkUser(req);

      if (user.length < 1) {
        return res.status(404).json({
          status_code: 404,
          message: `User ${req.body.email_username} Not Found`,
          data: null,
          request: {
            // status_code: 404,
            // message: "Not Found",
            url: "users/reset/request-forgot-password",
          },
        });
      }
      const secret = `${user[0].email.split("@")[0]}${user[0].password}`;
      const mail = user[0].email;
      const resetToken = jwt.sign(
        {
          id: user[0].id,
          email: user[0].email,
        },
        secret,
        {
          expiresIn: process.env.JWT_TOKENLIFE,
        }
      );
      const encodedToken = Buffer.from(resetToken).toString("base64");

      const link = `${process.env.API_URL_EMAIL}/forgot-password?mail=${mail}&resetToken=${encodedToken}`;
      const handlebarsOptions = {
        viewEngine: {
          defaultLayout: false,
        },
        viewPath: path.resolve("./views"),
      };
      const transport = nodemailer.createTransport({
        host: process.env.EMAIL_SERVICE,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      transport.use("compile", handlebars(handlebarsOptions));
      const options = {
        from: process.env.EMAIL_SENDER,
        to: mail,
        subject: "Request Reset Password",
        template: "emailReset",
        context: { resetLink: link },
      };
      transport.sendMail(options, (err, info) => {
        if (err) {
          return next(err);
        }
        transport.verify((error, success) => {
          if (error) {
            return res.status(409).json({ error });
          }
          if (success) {
            return res.status(200).json({
              status_code: 200,
              message: "Check your email to reset password",
              data: {
                email_username: `${req.body.email_username}`,
              },
              request: {
                status_code: 200,
                message: "Success",
                url: "users/reset/request-forgot-password",
              },
            });
          }
        });
      });
    } catch (error) {
      return next(error);
    }
  }

  //Reset Password
  static async forgotPassword(req, res, next) {
    try {
      const token = Buffer.from(req.body.resetToken, "base64").toString(
        "ascii"
      );
      const decoded = jwt.decode(token);
      req.body.email_username = decoded.email;
      const user = await userServices.checkUser(req);
      if (!user) return res.status(404).json({ message: `User Not Found` });
      const secret = `${user[0].email.split("@")[0]}${user[0].password}`;
      const verifyToken = (token, secret) => {
        try {
          jwt.verify(token, secret);
          return true;
        } catch (error) {
          return false;
        }
      };
      const isValidToken = verifyToken(token, secret);
      if (!isValidToken) {
        return res.status(401).json({
          status_code: 401,
          message: "Invalid Token",
          request: {
            status_code: 401,
            message: "Unauthorized",
            url: "users/reset/reset-forgot-password",
          },
        });
      }
      if (user[0].status == "disabled") {
        return res.status(401).json({
          status_code: 401,
          message:
            "Your account is disabled by administrator. Please contact administrator",
          request: {
            status_code: 401,
            message: "Unauthorized",
            url: "users/reset/reset-forgot-password",
          },
        });
      }
      // console.log("user", user);
      if (user.length > 0) {
        console.log(req.body.password);
        console.log(req.body.password_confirmation);
        if (req.body.password != req.body.password_confirmation) {
          return res.status(400).json({
            status_code: 400,
            message: "Password confirmation doesn't match Password",
            request: {
              status_code: 400,
              message: "Bad Request",
              url: "users/reset/reset-forgot-password",
            },
          });
        }
        const data = {
          password: bcrypt.hashSync(req.body.password, 10),
          updated_password: currentDate.dateAsiaJakarta,
          updated_by: user[0].id,
        };
        await userServices.updateUser(user[0].id, data);
        res.status(200).json({
          status_code: 200,
          message: "Password has been changed",
          request: {
            status_code: 200,
            message: "Success",
            url: "users/reset/reset-forgot-password",
          },
        });
      }
    } catch (error) {
      return next(error);
    }
  }
}
module.exports = ResetControllers;
