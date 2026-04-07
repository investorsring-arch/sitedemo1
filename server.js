const http = require('http')
const fs = require('fs')
const path = require('path')

const server = http.createServer((req, res) => {
  if (req.url === '/logistique') {
    const file = path.join(__dirname, 'public', 'tools', 'reference-logistique.html')
    const html = fs.readFileSync(file, 'utf8')
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(html)
  }
})

server.listen(3001, () => console.log('OK sur http://localhost:3001/logistique'))
