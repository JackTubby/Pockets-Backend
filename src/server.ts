import express from 'express'
import morgan from 'morgan'

const app = express()


app.use(morgan('dev'))
app.use(express.json()) // allows the client to send use JSON
app.use(express.urlencoded({extended: true})) // allows client to add query string or params otherwise it treats everything as a string

app.get('/', (req: any, res: any) => { // TODO: update types
  console.log('hello world')
  res.status(200)
  res.json({message: 'hello there!'})
})

export default app