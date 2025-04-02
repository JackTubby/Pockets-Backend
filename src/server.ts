/**
 * @description
 * This is the entry point of the application.
 * It imports the Express app from the server file and starts the server on port 3002.
 * It also logs the URL where the server is running.
 * It uses the morgan middleware for logging HTTP requests and responses.
 * It uses the cors middleware to allow cross-origin requests from http://localhost:5173.
 * It uses the express.json() middleware to parse incoming JSON requests.
 * It uses the express.urlencoded() middleware to parse incoming requests with URL-encoded payloads.
 */

import express, { Request, Response } from 'express';
import morgan from 'morgan'
import router from './router'
import cors from 'cors'

const app = express()

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
)
app.use(morgan('dev'))
app.use(express.json()) // allows the client to send use JSON
app.use(express.urlencoded({ extended: true })) // allows client to add query string or params otherwise it treats everything as a string

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'hello there!' })
})

app.use('/api', router)

export default app
