import { useEffect, useState } from "react"
import axios from "axios"
import "./App.css"

function App(){

  const [form,setForm]=useState({
    sno:"",
    name:"",
    year:"",
    department:"",
    address:""
  })

  const [students,setStudents]=useState([])
  const [editId,setEditId]=useState(null)

  const handleChange=e=>{
    setForm({...form,[e.target.name]:e.target.value})
  }

  const fetchStudents=async()=>{
    try{
      const res=await axios.get("http://localhost:5000/students")
      setStudents(res.data)
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    fetchStudents()
  },[])

  const submit=async()=>{
    try{
      if(editId){
        await axios.put(`http://localhost:5000/students/${editId}`,form)
        setEditId(null)
      }else{
        await axios.post("http://localhost:5000/students",form)
      }

      setForm({
        sno:"",
        name:"",
        year:"",
        department:"",
        address:""
      })

      fetchStudents()

    }catch(err){
      console.log(err)
    }
  }

  const edit=s=>{
    setForm({
      sno:s.sno,
      name:s.name,
      year:s.year,
      department:s.department,
      address:s.address
    })
    setEditId(s._id)
  }

  const del=async(id)=>{
    try{
      await axios.delete(`http://localhost:5000/students/${id}`)
      fetchStudents()
    }catch(err){
      console.log(err)
    }
  }

  return(
    <div className="container">

      <h2>Student CRUD with MONGO DB</h2>

      <form
        className="form-box"
        onSubmit={(e)=>{
          e.preventDefault()
          submit()
        }}
      >
        <input name="sno" value={form.sno} onChange={handleChange} placeholder="Reg No" required/>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required/>
        <input name="year" value={form.year} onChange={handleChange} placeholder="Year" required/>
        <input name="department" value={form.department} onChange={handleChange} placeholder="Department" required/>
        <input name="address" value={form.address} onChange={handleChange} placeholder="Address"/>

        <button className="main-btn" type="submit">
          {editId ? "Update" : "Add"}
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Sno</th>
            <th>Name</th>
            <th>Year</th>
            <th>Department</th>
            <th>Address</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {students.map(s=>(
            <tr key={s._id}>
              <td>{s.sno}</td>
              <td>{s.name}</td>
              <td>{s.year}</td>
              <td>{s.department}</td>
              <td>{s.address}</td>
              <td>
                <button className="edit" onClick={()=>edit(s)}>Edit</button>
                <button className="delete" onClick={()=>del(s._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}

export default App
