const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const {Schema} = mongoose

const app = express();

app.use(cors());
app.use(express.json())

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@cluster0.ldxip9t.mongodb.net/?retryWrites=true&w=majority`)

let waiterSchema = new Schema({
    id: String,
    name: String, 
    hours: Number,
    tips: Number
});

const Waiter = mongoose.model('Waiter', waiterSchema);

app.post("/addUser", async (req, res, next)=> {
    let camarero = req.body.camarero;
    let user;

        let userFound = await Waiter.findOne({name: camarero});

        if(userFound) {
        try {
            res.json({msg:"user exists"})
        }catch(err){
            res.json({msg: 'err'});
            
        }
    } else{
        try {
            user = new Waiter({
                id: uuidv4(),
                name: camarero,
                hours: 0,
                tips: 0
            });
            user.save();
            res.json(user)
        }catch(err){
            console.log(err)
        }
    } 
});


// A ver
app.post("/addUserHours", async (req, res, next) => {
    let camarero = req.body.camarero;
    let hours = req.body.hours;


})


app.delete("/removeWaiter/:id", async(req, res, next) => {
    let id = req.params.id;

    try{
       await Waiter.findOneAndDelete({id});
        res.json({msg:'removed'})
    }catch(err){
        console.log(err)
    }
})

app.get("/getAllUsers", async (req, res, next) => {
    let users;
    try {
        users = await Waiter.find({});
        
    }catch(err) {
        res.json({msg: err})
    }

    res.json(users)
})

app.listen(process.env.PORT || 3005, ()=>{
    console.log("Listening on 3005")
})