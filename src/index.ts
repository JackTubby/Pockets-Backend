import * as dotenv from 'dotenv'
dotenv.config() // this loads our env props that allows us to access them throughout our app
import app from './server'

app.listen(3001, () => {
  console.log('hello on http://localhost:3001')
})