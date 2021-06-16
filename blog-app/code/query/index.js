// importing packages
import express from 'express'
import axios from 'axios'
import cors from 'cors'

// create express application
const app = express()
app.use(express.json())
app.use(cors())

// posts service port
const PORT = 5003

const posts = {}

const handleEvent = (type, data) => {
    switch(type) {
        case 'PostCreated':
            const { id, title } = data
            posts[id] = { id, title, comments: [] }
            break;
        case 'CommentCreated':
            var id = data.id
            var content = data.content
            var status = data.status
            var post = posts[data.postId]
            post.comments.push({ id, content, status })
            break;
        case 'CommentUpdated':
            var id = data.id
            var content = data.content
            var status = data.status
            const post = posts[data.postId]
            const comment = post.comments.find(comment => {
                return comment.id === id;
            })
            comment.status = status
            comment.content = content
            break;
    }
}

// handle GET requests
app.get('/posts', (req, res) => {
    res.send(posts);
})

// handle POST request
app.post('/events', (req, res) => {
    const { type, data } = req.body;

    handleEvent(type, data);
    console.log('Type:', type)

    res.send({});
})

// create service
app.listen(PORT, async () => {
    console.log('query service is running at port', PORT)

    const res = await axios.get('http://localhost:5004/events')
    for (let event of res.data) {
        console.log('Processing event:', event.type)
        handleEvent(event.type, event.data)
    }
})