const express = require('express')
const morgan = require('morgan');
const app = express();
app.use(express.json());
app.use(morgan('tiny'))
app.use(express.static('dist'));
const dataLogger = ()=>{
    morgan.token('data', function (req, res) {
    return JSON.stringify(req.body);
 })
    return morgan(function(tokens,req,res){
        return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens.data(req,res),
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
    })
}
let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
const generateId = ()=>{
    const ids = persons.map(person => Number(person.id))
    const maxValue = ids.length > 0 ? Math.max(...ids) + 1 : 1;
    return maxValue;
}
app.get('/api/persons',(req,res)=>{
    res.json(persons);
})
app.get('/api/info',(req,res)=>{
    const days = ["Sun","Mon","Tues","Wed","Thu","Fri","Sat"]
    const time = new Date();
    const date = time.getDate();
    const year = time.getFullYear();
    const day = time.getDay();
    const month = time.getMonth();
    res.send(`
        Phonebook has information about ${persons.length} people 
        <br/> Today is ${days[day]} ${date} ${month} ${year}`
    );
})
app.get('/api/persons/:id',(req,res)=>{
    const id = req.params.id;
    const person = persons.find(person => person.id === id)
    if(person){
        res.status(200).json(person)
    }else{
        res.status(404).end();
    }
    console.log(generateId())
})
app.delete('/api/persons/:id',(req,res)=>{
    const id = req.params.id;
    persons = persons.filter(person => person.id!==id);
    res.status(200).end();
})
app.post('/api/persons',dataLogger(),(req,res)=>{
    const newPerson = req.body;
    const id = String(generateId());
    if(!req.body.name || !req.body.number){
       return res.status(404).json({
            error: 'content is missing'
        })
    }
    let person = persons.find(person => person.name === req.body.name)
    if(person){
        return res.status(404).json({error: 'Name is already present'})
    }
    persons = persons.concat({id:id,...req.body})
    res.json(newPerson);
    console.log(persons)

})
const PORT = 3001;
app.listen(PORT)
console.log("app running at port 3001")