import 'dotenv/config.js'
import express from 'express'

const app = express()

app.use(express.json())

app.listen(process.env.PORT, () => {
    console.log('Server is running on http://localhost:8000')
})
