require('dotenv').config();

const express = require ('express');
const app = express();
const jwt = require('jsonwebtoken');
const session = require('express-session');

const users = [
{
    username:'abc@gmail.com',
    password:12345
}

];
app.use(session({
    name: 'session.sid',
    secret: 'entersomepasswordhere',
    resave: false,
    saveUninitialized: false
}));

app.set('view-engine','ejs');

app.use(express.urlencoded({extended:false}))

// TO authenticate via middlewares
app.get('/users', authenticateToken ,(req,res)=>{
    console.log(req.user,users);
  res.json(users.filter(user =>user.username === req.user.name));
})


app.get('/',(req,res)=>{
    res.render('home.ejs');
})

// When url is hit

app.get('/login',(req,res)=>{
    console.log(req.originalUrl, 'Request logged');
    if(!req.loggedIn){
        res.render('login.ejs');
    } else { 
        res.redirect('/users')
    }
    
})

// When login button is hit 

app.post('/login', (req,res)=>{

//Authenticate user
const userName = req.body.name;
const user = {name:userName};

const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET);
res.json({accessToken:accessToken});

})

function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    const authToken = authHeader  && authHeader.split(' ')[1];

    if(authToken === null) return res.sendStatus(401);

    jwt.verify(authToken,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err) return res.send(err)
        req.user = user;
        next()
    })
}

app.listen(5000,()=>{
    console.log('Server is listening on port 5000')
})