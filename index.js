const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const session = require('express-session')
const flash = require('express-flash')
const app = express();
const bodyParser = require('body-parser')
const ConnectDB = require('./DataBase/connectdb')
const router = require('./Router/web')


const DATABASE_URL = process.env.URL
ConnectDB(DATABASE_URL)

app.use(bodyParser.urlencoded({extended:false}));

app.use(flash());
app.use(session({
    secret:"yashrajismyname",
    resave:false,
    saveUninitialized:false,
    cookie:{secure:false}
}))

app.set('view engine','pug')
app.set('views','./Views')

app.use('/',router)

const port = process.env.PORT

app.listen(port,()=>{
    console.log(`serving running at port ${port}`);
})