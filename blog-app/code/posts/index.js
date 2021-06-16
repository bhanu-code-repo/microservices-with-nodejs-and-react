// importing packages
import express from 'express'
import axios from 'axios'
import cors from 'cors'
import { randomBytes } from 'crypto'

// create express application
const app = express()
app.use(express.json())
app.use(cors())

// posts service port
const PORT = 5001;

// create in-memory post storage
const posts = {}

// handle GET requests
app.get('/posts', (req, res) => {
    res.send(posts)
})

// handle POST requests
app.post('/posts', async (req, res) => {
    // generate post id
    const id = randomBytes(4).toString('hex')
    
    // get title from the incoming request
    const { title } = req.body
    
    // create post
    posts[id] = {
        id, title
    }

    // emmit event to event bus
    await axios.post('http://localhost:5004/events', {
        type: 'PostCreated',
        data: {
            id,
            title
        }
    })

    // return status and new post
    res.status(201).send(posts[id])
})

app.post('/events', (req, res) => {
    console.log('Received Event:', req.body.type)
    res.send({})
})

// create service 
app.listen(PORT, () => 
    console.log('posts service is running at port', PORT)
)