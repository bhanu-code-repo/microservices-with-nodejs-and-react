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
const PORT = 5002;

// create in-memory post storage
const commentsByPostId = {}

// handle GET requests
app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || [])
})

// handle POST requests
app.post('/posts/:id/comments', async (req, res) => {
    // generate random comment id
    const commentId = randomBytes(4).toString('hex');

    // get content from the incoming request
    const { content } = req.body;

    // add to comments to post
    const comments = commentsByPostId[req.params.id] || [];
    comments.push({ id: commentId, content, status: 'pending' })
    commentsByPostId[req.params.id] = comments;

    // emmit event to event bus
    await axios.post('http://localhost:5004/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: 'pending'
        }
    });

    // return status and added comments
    res.status(201).send(comments);
})

app.post('/events', async (req, res) => {
    console.log('Received Event:', req.body.type)
    const { type, data } = req.body

    if (type === 'CommentModerated') {
        const { postId, id, status, content } = data
        const comments = commentsByPostId[postId]

        const comment = comments.find(comment => {
            return comment.id === id;
        })

        comment.status = status

        await axios.post('http://localhost:5004/events', {
            type: 'CommentUpdated',
            data: {
                id,
                status,
                postId,
                content
            }
        })
    }

    res.send({})
})

// create service
app.listen(PORT, () => 
    console.log('comments service is running at port', PORT)
)