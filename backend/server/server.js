const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(
"mongodb+srv://admin:admin123@cluster0.juikcjw.mongodb.net/studentcrud?retryWrites=true&w=majority"
)
.then(()=>console.log("Mongo Connected"))
.catch(err=>console.log("Mongo Error:", err))

const StudentSchema = new mongoose.Schema({
  sno: String,
  name: String,
  year: String,
  department: String,
  address: String
})

const Student = mongoose.model("Student", StudentSchema)

app.get("/students", async (req,res)=>{
  try{
    const data = await Student.find()
    res.json(data)
  }catch(err){
    console.log(err)
    res.status(500).send(err.message)
  }
})

app.post("/students", async (req,res)=>{
  try{
    console.log("Incoming:", req.body)

    const data = new Student({
      sno:req.body.sno,
      name:req.body.name,
      year:req.body.year,
      department:req.body.department,
      address:req.body.address
    })

    await data.save()
    res.json(data)

  }catch(err){
    console.log("POST ERROR:", err)
    res.status(500).send(err.message)
  }
})

app.put("/students/:id", async (req,res)=>{
  try{
    const data = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new:true}
    )
    res.json(data)
  }catch(err){
    console.log(err)
    res.status(500).send(err.message)
  }
})

app.delete("/students/:id", async (req,res)=>{
  try{
    await Student.findByIdAndDelete(req.params.id)
    res.json("Deleted")
  }catch(err){
    console.log(err)
    res.status(500).send(err.message)
  }
})

app.listen(5000,()=>console.log("Server running"))
