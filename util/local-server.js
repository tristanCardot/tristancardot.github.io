#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const http = require('http')

const EXT_TO_MIME = new Map([
	['default', 'application/octet-stream'],
	['.txt', 'text/plain'],
	['.html', 'text/html; charset=utf-8'],
	['.js', 'application/javascript; charset=utf-8'],
	['.json', 'application/json; charset=utf-8'],
	['.png', 'image/png'],
	['.jpg', 'image/jpeg'],
	['.webp', 'image/webp'],
	['.css', 'text/css'],
	['.svg', 'image/svg+xml'],
])


const port = process.argv[2] || 8080

http.createServer((req, res) => {
	let url = req.url.split(/[?#]/)[0].split('/').slice(1).join('/')
	let localPath = path.join(__dirname, '../', url)

	let extName = path.extname(localPath)
	if (extName === '') {
		extName = '.html'
		localPath = path.join(localPath, 'index.html')
	}
	let mime = EXT_TO_MIME.get(extName) || EXT_TO_MIME.get('default')

	let fileStream = fs.createReadStream(localPath)
	fileStream
		.on('error', err => {
			let status = err.code==='ENOENT' ? 404 : 500
			res.writeHead(status, { 'Content-Type': 'application/json' })
			res.end(JSON.stringify({
				message: err.message,
				stack: err.stack,
				code: err.code,
			}))
		})
		.on('open', () => {
			mime && res.setHeader('Content-Type', mime)
			fileStream.pipe(res)
		})
})
.on('clientError', (err, socket) => socket.end('HTTP/1.1 400 Bad Request\r\n\r\n'))
.listen(port)

console.log(`node ${process.version}, écoute sur le port ${port}.`)
