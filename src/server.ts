import express, { Request, Response } from 'express';
import morgan from 'morgan'
import { signIn, signUp } from './handlers/user'
import { userValidation } from './handlers/userValidation'
import router from './router'
import { protect } from './modules/auth'
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

app.post('/api/signup', signUp)
app.post('/api/signin', signIn)
app.use('/api', protect, router)

export default app
