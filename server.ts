import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { connect } from './src/actions/stocks/connect_yf_scraper'
import { Server } from 'socket.io'
 
const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handler = app.getRequestHandler()
 
app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    handler(req, res, parsedUrl)
  })
  const io = new Server(httpServer)
  io.on('connection', connect)
  httpServer.listen(port)
 
  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  )
})
