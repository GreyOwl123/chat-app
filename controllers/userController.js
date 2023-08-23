const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const id = require("uuid")
const async = require ("async");
const passport = require("passport");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

// User registration
exports.user_signup = [
 body("username", "Username is required")
    .trim()
    .isLength({ min: 4 })
    .escape(),
 body("password")
     .trim()
     .isLength({ min: 6 })
     .isAlphanumeric(),

(req, res, next) => { 
 const errors = validationResult(req);
 if (!errors.isEmpty()) {
     res.render({  // Rewrite
         title: "",
         user: req.body,
         errors: errors.array(),
       });
     return;
   } 

 bcryptjs.hash(req.body.password, 10, async (err, hashedPassword) => {
  const user = new User({
     username: req.body.username,
     password: hashedPassword,
 })
 .then((user) => {
   const timeLimit = 2 * 60 * 60;
   const token = jwt.sign(
     { id: user._id, username, role: user.role },
   jwtSecret,
   {
     expiresIn: timeLimit,
   }
  ); 
  res.cookie("jwt", token, {
    httpOnly: true,
    timeLimit: timeLimit * 1000,
 });
})
await user.save()
   .then(() =>{
     res.status(200).json({
       message: "Signup Successful",
       user,
     })
   })
   .catch((err) => {
    res.status(401).json({
      message: "Signup Failed",
      error: err.message,
    })
   })
 res.redirect('/author/login')
 })
}
]

// User login
exports.user_login =
   passport.authenticate("local", {
      session:false,
      successRedirect: "/",
      failureRedirect: "/",
   });

// User Account
exports.user_detail = (req, res, next) => {
    async.parallel(
        {
            user(callback) {
                User.findById(req.params.id).exec(callback);
            },
        },
        (err, results) => {
          if (err) {
            return next (err);
          }
          if(results.user == null) {
            const err = new Error("Account not found");
            err.status = 404;
            return next(err);
          }
          res.json("", {  // Rewrite
            title: "",
            user: results.user,
          });
        }
    )
  }


exports.user_update = [
    body("username")
       .trim()
       .isLength({ min: 4 })
       .escape(),
    body("password")
        .trim()
        .isLength({ min: 6 })
        .isAlphanumeric(),

  (req, res, next) => {
    const errors = validationResult(req); 

    const user = new User({
     username: req.body.username,
     password: req.body.password,
     _id: req.params.id, 
   });
 
     if (!errors.isEmpty()) {
      (err,results) => {
        if (err) {
         return next(err);
        }
       res.json("", {
         title: "",
         user: results.user,
         errors: errors.array(),
       });
      };
     return;
    }
   User.findByIdAndUpdate(req.params.id, user, {}, (err, theuser)  => {
     if (err) {
       return next(err);
     }
    res.redirect(theuser.url);
   });
 },
 ];


exports.user_delete = (req, res, next) => {
    async.parallel(
        {
          user(callback) {
            User.findById(req.body.userid).exec(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          if (results === null) {
            res.json("", {
              title: "",
              user: results.user,
            });
        return;
          }
          User.findByIdAndRemove(req.body.userid, (err) => {
            if (err) {
              return next(err);
            }
            res.redirect("/api/authors");
          });
        }
    );    
};
