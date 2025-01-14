import express from "express";
import mongoose from "mongoose";
import cors from 'cors'

const app = express();

// allow cors 
app.use(cors())

const PORT = 5000;
mongoose.connect("mongodb://localhost:27017/NTDL-DB").then(()=>{
  app.listen(PORT, () => {
    console.log("SERVER STARTED",PORT);
  });
  console.log("db connected");}).catch((error)=>{
  console.log(error)
});

const taskSchema = new mongoose.Schema(
  {
    task: String,
    hr:Number,
    type:String
  }
)
const Task = mongoose.model('task',taskSchema)

// middleware to populate req.body
app.use(express.json());

app.post("/api/v1/tasks", async (request, response) => {
  try {
    const taskCreated = await new Task(request.body).save();

    const responseObject = {
      status: "success",
      message : "Task created",
      task: taskCreated
    }
    response.status(201).send(responseObject); 
  } catch (error) {
    response.status(500).send({ status: "error", message: error.message })
  }
});

app.get("/api/v1/tasks", async (request, response) => {
  try {
    const allTask = await Task.find();
    const responseObject = {
      status: "success",
      message : "Tasks fetched",
      task: allTask
    }
    response.status(200).send(responseObject);
  } catch (error) {
    response.status(500).send({ status: "error", message: error.message })
  }
  
});

app.get("/api/v1/tasks/:id", async (request, response) => {
  const {id} = request.params;
  try {
    const oneTask = await Task.findById(id)
    const responseObject = {
      status: "success",
      message : "Task fetched",
      task: oneTask
    }

    response.status(200).send(responseObject); 
  } catch (error) {
    response.status(500).send({ status: "error", message: error.message })
  }
  
});

// updating tasks
app.put("/api/v1/tasks/:id", async (request, response) => {
  try {
    const id = request.params.id;
  const newData = request.body;
  const taskdata=await Task.findByIdAndUpdate(id,{
    $set:newData
  },{new:"true"})

  if (!taskdata) {
    return response.status(404).send({ status: "error", message: "Task not found" });
  }

  const responseObject = {
    status: "success",
    message : "Task updated",
    task: taskdata
  }

  response.status(200).send(responseObject); 

  } catch (error) {
    response.status(500).send({ status: "error", message: error.message })
  }
  
  
});

// update certain data of a task
app.patch("/api/v1/tasks/:id", async (request, response) => {
  try {
    const id = request.params.id;
  const newData = request.body;
  const taskdata=await Task.findByIdAndUpdate(id,{
    $set:newData
  },{new:"true"})

  const responseObject = {
    status: "success",
    message : "Task updated",
    task: taskdata
  }
  
  response.status(200).send(responseObject); 

  } catch (error) {
    response.status(500).send({ status: "error", message: error.message })
  }
});

// deleting task
app.delete("/api/v1/tasks/:id", async (request, response) => {
  try {
    const id = request.params.id;
  const taskdata=await Task.findByIdAndDelete(id)

  const responseObject = {
    status: "success",
    message : "Task deleted",
    task: taskdata
  }
  
  response.status(200).send(responseObject);

  } catch (error) {
    response.status(500).send({ status: "error", message: error.message })
  }
});



