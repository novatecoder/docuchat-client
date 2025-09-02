# File: server.py
import http.server
import socketserver
import os

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Serve index.html for root requests to handle client-side routing
        if self.path == '/':
            self.path = '/index.html'
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

# Add MIME types for TypeScript and TSX files so the browser executes them as JavaScript
Handler.extensions_map.update({
    '.ts': 'application/javascript',
    '.tsx': 'application/javascript',
})

# Change directory to the script's location to ensure files are served correctly
os.chdir(os.path.dirname(os.path.abspath(__file__)))

httpd = socketserver.TCPServer(("", PORT), Handler)

print(f"DocuChat AI client is running.")
print(f"Open your browser and navigate to http://localhost:{PORT}")
httpd.serve_forever()
