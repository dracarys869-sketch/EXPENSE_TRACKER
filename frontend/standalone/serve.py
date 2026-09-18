import http.server
import socketserver
import os

PORT = 3001
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
STANDALONE_FILE = os.path.join(DIRECTORY, 'index.html')

class SinglePageAppHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        path = self.translate_path(self.path)
        if not os.path.exists(path) or os.path.isdir(path):
            self.path = '/index.html'
        return super().do_GET()

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), SinglePageAppHandler) as httpd:
        print(f"Frontend static server running on http://localhost:{PORT}")
        print(f"Serving: {STANDALONE_FILE}")
        httpd.serve_forever()
