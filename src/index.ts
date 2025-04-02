/**
 * @description
 * This is the entry point of the application.
 * It imports the Express app from the server file and starts the server on port 3002.
 * It also logs the URL where the server is running.
 */

import app from './server'

const PORT = 3002

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
