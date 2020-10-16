var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

let User = require('../models/user');


// Login
router.post('/login', function(req, res, next) {
  req.session.regenerate((err) => {
      if(err){
        res.status(402).json();
      }
      else{
          let username = req.body.username || '';
          let password = req.body.password || '';

          User.findOne({username : username}, (err, user) => {
              if(err || !user) {
                res.status(402).json();
              }
              else{
                bcrypt.compare(password, user.password, (err2, isValid) => {
                  if(err2 || !isValid){
                    res.status(402).json();
                  }
                  else{
                    req.session.user = user;

                    let userNoPassword = {
                        username : user.username,
                        _id : user._id,
                        firstName : user.firstName,
                        lastName : user.lastName,
                        member : user.member,
                        staff : user.staff
                    };
  
                    res.json(userNoPassword);
                  }
                });
              }
          });
      }
  });
});

require('./mock')();

module.exports = router;
