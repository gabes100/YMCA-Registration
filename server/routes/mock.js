let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let User = require('../models/user');
let Program = require('../models/program');

async function mockUser(){
    
    let users = [
        {
            username : "thoman.timothy", 
            password : bcrypt.hashSync("123123123", 10), 
            firstName : "Tim",
            lastName : "Thoman",
            member : false,
            staff : true
        },
        {
            username : "veldboom.gabriel", 
            password : bcrypt.hashSync("abcabcabc", 10), 
            firstName : "Gabriel",
            lastName : "Veldboom",
            member : false,
            staff : true
        },
        {
            username : "doe.john", 
            password : bcrypt.hashSync("111222333", 10), 
            firstName : "John",
            lastName : "Doe",
            member : true,
            staff : false
        }
    ];

    await User.insertMany(users);
}

async function mockProgram(){
    let programs = [
           {
            name : "Advanced Swimming Lessons",
            capacity : 10,
            location : "YMCA pool",
            fee : 96,
            time : "1:00pm - 1:30pm",
            date : "Sunday",
            description : "Participants must pass beginner lessons."
            
           },
           {
            name : "Log Rolling",
            capacity : 4,
            location : "YMCA pool",
            fee : 110,
            time : "2:00pm - 4:00pm",
            date : "Monday",
            description : "Log rolling is a sport in which two contestants stand on a floating log and try to knock each other off by spinning it with their feet. This is a competitive program with limited capacity."
           },
           {
            name : "Yoga",
            capacity : 20,
            location : "Upper Gym",
            fee : 65,
            time : "6:00pm - 7:00pm",
            date : "Friday",
            description : "Learn the benefits of yoga. Participants must be 21 or order to join."
            
           },
           {
            name : "Personal Training Session 1",
            capacity : 1,
            location : "Lower Gym",
            fee : 50,
            time : "9:00am - 10:00am",
            date : "Tuesday",
            description : "1-1 Training sessions with an instructor."
           },
           {
            name : "Personal Training Session 2",
            capacity : 1,
            location : "Lower Gym",
            fee : 50,
            time : "9:00am - 10:00am",
            date : "Thursday",
            description : "1-1 Training sessions with an instructor."
           },
           {
            name : "Personal Training Session 3",
            capacity : 1,
            location : "Lower Gym",
            fee : 50,
            time : "3:00pm - 4:00pm",
            date : "Tuesday",
            description : "1-1 Training sessions with an instructor."
           }
    ];

    await Program.insertMany(programs);
}

async function mockData(){
    await mongoose.connection.dropDatabase();

    await mockUser();
    await mockProgram();
}

module.exports = mockData;