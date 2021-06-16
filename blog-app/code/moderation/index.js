// importing packages
import express from 'express'
import axios from 'axios'

// create express application
const app = express()
app.use(express.json())


// posts service port
const PORT = 5005

const handleEvent = async (type, data) => {
    // perform comment moderation
    if (type === 'CommentCreated') {
        const status = data.content.includes('kill'.toLowerCase()) ? 'rejected' : 'approved'
        await axios.post('http://localhost:5004/events', {
            type: 'CommentModerated',
            data: {
                id: data.id,
                postId: data.postId,
                status,
                content: data.content
            }
        })
    }
}

app.post('/events', (req, res) => {
    const { type, data } = req.body

    handleEvent(type, data)

    res.send({})
})

// create service
app.listen(PORT, async () => {
    console.log('moderation service is running at port', PORT)

    const res = await axios.get('http://localhost:5004/events')
    for (let event of res.data) {
        console.log('Processing event:', event.type)
        handleEvent(event.type, event.data)
    }
})