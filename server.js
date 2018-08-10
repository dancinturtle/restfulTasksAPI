const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose')
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/taskAPIEastBay', {useMongoClient: true});

var TaskSchema = new mongoose.Schema({
    title: {type: String, required: [true, "A title must be provided"], minlength: [3, "A title must have at least 3 characters"]},
    description: {type: String, default: ""},
    completed: {type: Boolean, default: false}
}, {timestamps: true})

mongoose.model('task', TaskSchema); // setter
const Task = mongoose.model('task'); // getter

const app = express();

app.use(bodyParser.json());

app.get('/', function(req, res){
    res.json({message: "Return error"})
})
app.get('/tasks', function(req, res){
    Task.find({}, function(err, tasks){
        if(err){
            res.json({message: false, error: err})
        }
        else {
            res.json({message: true, tasks: tasks})
        }
    })
})
app.post('/tasks', function(req, res){
    console.log("post data", req.body);
    Task.create(req.body, function(err, task){
        if(err){
            console.log(err);
            res.json({message: false, error: err})
        }
        else {
            res.json({message: true, data: task})
        }
    })
})
app.put('/tasks/:id', function(req, res){
    // update an existing task
    console.log("put data", req.params.id, req.body)
    let id = req.params.id;

    Task.findById(id, function(err, task){
        if(err){
            console.log("error finding the task", err);
            res.json({message: false, error: err})
        }
        else {
            task.title = req.body.title;
            task.description = req.body.description;
            task.completed = req.body.completed;
            task.save(function(err, task){
                if(err){
                    res.json({message: false, error: err});
                }
                else {
                    res.json({message: true, data: task})
                }
            })

        }
    })


})
app.delete('/tasks/:id', function(req, res){
    console.log("deleting this one", req.params.id)
    Task.remove({_id: req.params.id}, function(err, data){
        if(err){
            res.json({message: false, error: err})
        }
        else {
            res.json({message: true, data: data})
        }
    })
})
app.get('/tasks/:id', function(req,res){
    console.log("finding by id", req.params.id)
    Task.findById(req.params.id, function(err, data){
        if(err){
            res.json({message: false, error: err})
        }
        else{
            res.json({message: true, data: data})
        }
    })
})

app.listen(8000, ()=>console.log("listening on port 8000"))
