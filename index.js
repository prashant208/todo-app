const express = require('express');

// GET THE PATH OBJECT TO SET THE PATH OF CSS FILE (OR JAVASCRIPT FILE)
const path = require('path');

const { toUnicode } = require('punycode');
// PORT NUMBER AT WHICH OUR SERVER WILL BE RUNNING
const port = 8000;

// CREATE OBJECT OF EXPRESS
const app = express();

// CREATE TO THE DATABASE
const db = require('./config/mongoose');

// IMPORT THE TODO OBJECT FROM MODELS
const Todo = require('./models/todo');

// USING EJS AS TEMPLE ENGINE
app.set('view engine', 'ejs');

// SET THE PATH OF VIEWS DIRECTORY
app.set('views', path.join(__dirname, 'views'));

// FOR DECODING URL
app.use(express.urlencoded());

// USE THE CSS AND JAVASCRIPT FILE
app.use(express.static('assets'));


// THIS IS HOME PAGE URL
app.get('/', function(req, res){
    Todo.find({}, function(err, todo){
        if(err){
            console.log("Error in fetching data from db");
            return
        }
        return res.render('home', {
            title: "TODO APP",
            todo_list: todo
        });
    });
});

// THIS IS URL FOR CREATING THE TASK IN DATABASE
app.post('/create-todo', function(req,res){
    Todo.create({
        description: req.body.description,
        category: req.body.category,
        date: req.body.date
    }, function(err, newTodo){
        if(err){
            console.log('error in creating todo!', err);
            return;
        }
        console.log('****', newTodo);
        return res.redirect('back');
    });
});



// THIS IS DELETE URL FOR SINGLE TASK FROM DATABASE
app.get('/delete_todo_single', function(req,res){
    let id = req.query.id;

    Todo.findByIdAndDelete(id, function(err){
        if(err){
            console.log('error in deleting an object from database');
            return;
        }
        return res.redirect('back');
    });
});


// THIS IS URL TO DELETE THE MULTIPLE ITEM FROM DATABASE
app.post('/delete-todo', function(req, res){
    let ids = req.query.ids;

    // if single task is to be deleted
    if(typeof(ids)== "string"){
        Todo.findByIdAndDelete(ids, function(err){
            if(err){
                console.log('error in deleting');
                return;
            }
        });
    }
    else{
        // if multiple tasks is to be deleted
        for(let i = 0; i < ids.length; i++){
            Todo.findByIdAndDelete(ids, function(err){
                if(err){
                    console.log('error in deleting');
                    return;
                }
            });
        }
    }
    return res.redirect('back');
});


// SERVER
app.listen(port, function(err){
    if(err){
        console.log("Error in running the server:",err);
    }
    console.log("Yup you'r in:",port);
});