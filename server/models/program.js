let mongoose = require('mongoose');
let programSchema = new mongoose.Schema(
   {
        name : String,
        capacity : Number,
        location : String,
        fee : Number,
        time : String,
        description : String,
		date : String,
	    day: [{
			type: String
		}]
   }
)

let Program = mongoose.model( 'Program', programSchema );
module.exports = Program;
