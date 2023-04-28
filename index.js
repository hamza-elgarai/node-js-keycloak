var express = require('express')
const cors = require('cors');
var Keycloak = require('keycloak-connect')
var session = require('express-session');
const {kcConfig} = require('./Keycloak');
var PORT = 3200;

var app = express();

var memoryStore = new session.MemoryStore();

//This method is to return 403 status code instead of redirecting to login page
Keycloak.prototype.redirectToLogin = function(req) {
  return false;
};


let keycloak = new Keycloak({ store: memoryStore }, kcConfig);

app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
  }));
  

//CORS support
app.use(cors({
    origin: 'http://localhost:3000'
}))

//Allow the app to use Keycloak middleware to be able to use keycloak.protect("role")
app.use(keycloak.middleware());


//Routes
app.get('/admin',keycloak.protect('admin'),function(req,res){
    res.send('This data is sent by Express endpoint for admin users only')
});
app.get('/user',keycloak.protect(),function(req,res){
    res.send('This data is sent by Express endpoint for authenticated users')
});
app.get('/public',function(req,res){
    res.send('This is public content !')
});



app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})
