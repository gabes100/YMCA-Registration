var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

let User = require('../models/user');
let Program = require('../models/program');


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
                        staff : user.staff,
                        programs : user.programs
                    };
  
                    res.json(userNoPassword);
                  }
                });
              }
          });
      }
  });
});

// Register
router.post('/register', function(req, res, next) {
  req.session.regenerate((err) => {
      if(err){
        res.status(402).json();
      }
      else{
          let firstName = req.body.firstName || '';
          let lastName = req.body.lastName || '';
          let username = req.body.username || '';
          let password = req.body.password || '';

          let newUser = {
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            username : req.body.username,
            password : bcrypt.hashSync(req.body.password, 10),
            member : false,
            staff : false
          }

          User.findOne({username : username}, (err, user) => {
              if(!user) {
                user = new User(newUser);
                req.session.user = user;
                user.save();

                delete user['password'];
                res.json(user);

              }
              else{
                res.status(402).json();
              }
          });
      }
  });
});

// Gets the programs
router.get('/programs', function(req, res, next){
  Program.find({}, (err, programs) => {
    if(err){
      res.status(500).send("Error in programs");
    }
    else{
      res.json(programs)
    }
  });
});

// Creates a new program
router.post('/program', function(req, res, next){
  let program = new Program(req.body);
  program.save();
  res.json(program);
});

// Deletes a program
router.delete('/program', function(req, res, next){
  Program.deleteOne({"_id" : req.query.program}, (err, result) => {
    if(err){
      res.status(500).send("Error in deleting program");
    }
    else{
      res.json(result);
    }
  });
});

// Gets the user programs
router.get('/programs/:userid', function(req, res, next){
  let userid = req.params.userid;
  User.findById(userid, (err1, user) =>{
    if(err1){
      res.status(500).send("Error in finding user");
    }
    else{
      Program.find({_id : {$in: user.programs}}, (err2, programs) =>{
        res.json(programs);
      })
    }
  })
})

// Updates a program
router.put('/program/:userid', function(req, res, next){
  let userid = req.params.userid;
  Program.replaceOne({_id: userid}, req.body, (err, result) =>{
    res.json(result);
  })
  
});

// Signs up user to program
router.put('/:userid', function(req, res, next){
  let userid = req.params.userid;
  let programid = req.body.programid;
  Program.findByIdAndUpdate(
    programid, 
    { $inc: { capacity: -1}},
    (err, program) =>{
      User.findById(userid, (err2, user) =>{
        user.programs.push(programid)
        user.save();
        res.json(user);
      })
    })
});

// Logout
router.post('/logout', (req, res, next) => {
  req.session.destroy((err) =>{
    res.json("success");
  });
});

require('./mock')();

module.exports = router;
