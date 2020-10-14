let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let User = require('../models/user');

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

async function mockData(){
    await mongoose.connection.dropDatabase();

    await mockUser();
}

module.exports = mockData;