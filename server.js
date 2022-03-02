//creating a backend 

var express =  require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')
const { sendStatus } = require('express/lib/response')

 mongoose.Promise = Promise


app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}))
//create message array with  two object name and message

var dburl= 'mongodb+srv://jules:Julesle2020@learningnode.5j1fo.mongodb.net/learningNode?retryWrites=true&w=majority'

var Message = mongoose.model('Message',    {
    name : String,
    message: String                                             
})      
var messages  =[
     
] 

app.get('/messages' , (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
   // res.send(messages)
})

app.post('/messages' , (req, res) => {
    //console.log(req.body)
    var message = new Message(req.body)
    message.save()
    .then(() =>{
      console.log('saved')
      return Message.findOne({message: 'badword'})
    })
    .then( censored =>{
        if(censored){
            console.log('censored word found ', censored)
            return Message.remove({_id : censored.id})
        }
        //messages.push(req.body)
        io.emit('message', req.body)
        res.sendStatus(200)
    })
    .catch((err) => {
        res.sendStatus(500)
        return console.error(err)
    })
    
})
  
/*   this block of code became useless because of implementation of promises
//because of the promises the below comented lines are not useful anymoree
      //  if(err)
          // sendStatus(500)
          Message.findOne({message: 'badword'}, (err, censored) =>{
           
        })
    */
       

    
io.on('connection', (socket)=> {
    console.log('a user connected')
})

mongoose.connect(dburl, (err)=> {
    console.log('MongoDb connection', err)
})
var server = http.listen(3000, ()=>{
    console.log('Server is listening on port', server.address().port)
})