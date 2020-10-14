let mongoose = require('mongoose');
let userSchema = new mongoose.Schema(
   {
      username : { type : String, unique : true},
      password : { type : String, required : true},
      firstName : {type : String},
      lastName : {type : String},
      member : {type : Boolean},
      staff : {type : Boolean}
   }
)

let User = mongoose.model( 'User', userSchema );
module.exports = User;