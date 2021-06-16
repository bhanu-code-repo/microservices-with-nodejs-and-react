// importing packages
import express from 'express'
import axios from 'axios'

// create express application
const app = express()
app.use(express.json())

// posts service port
const PORT = 5004

// create in-memory post storage
const events = []

// handle GET requests
app.get('/events', (req, res) => {
    res.send(events)
})

// handle POST requests
app.post('/events', (req, res) => {
    // get event from request body
    const event = req.body

    // add event to list
    events.push(event)

    // post event to all services
    axios.post('http://localhost:5001/events', event).catch((err) => {
        console.log('Posts Service:', err.message)
    })
    
    axios.post('http://localhost:5002/events', event).catch((err) => {
        console.log('Comments Service:', err.message)
    })

    axios.post('http://localhost:5003/events', event).catch((err) => {
        console.log('Query Service:', err.message)
    })

    axios.post('http://localhost:5005/events', event).catch((err) => {
        console.log('Moderation Service:', err.message)
    })

    res.send({'status': 'OK'})
})

// create service
app.listen(PORT, () => 
    console.log('event bus service is running at port', PORT)
)