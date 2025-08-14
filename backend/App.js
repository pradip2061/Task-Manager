const express = require('express')
require('dotenv').config();
const connectToDatabase = require('./database')
const cookieparser = require('cookie-parser')
const signwithgoogle = require('./router/SignInGoogleRouter')
const cors =require('cors');
const createRouter = require('./router/CrudRouter');
const app = express()
app.use(express.json())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(cookieparser())
connectToDatabase()

app.use('/milestone',signwithgoogle)
app.use('/milestone',createRouter)
const PORT =3000
app.listen(PORT,()=>{
    console.log(`the project running at ${PORT}`)
})