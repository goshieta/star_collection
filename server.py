from http.server import SimpleHTTPRequestHandler, HTTPServer

server = HTTPServer(('', 8000), SimpleHTTPRequestHandler)  #サーバインスタンスを生成
print("サーバーを http://127.0.0.1:8000/ に開きました。サーバーを終了する際はctrl+cを押してください。")
server.serve_forever()   #常時受けつけモードを指定。