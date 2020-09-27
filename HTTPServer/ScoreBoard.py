#!/usr/bin/env python3
"""
Very simple HTTP server in python for logging requests
Usage::
    ./server.py [<port>]
"""
from http.server import BaseHTTPRequestHandler, HTTPServer
import logging
import json

HighScoreList=[]



class S(BaseHTTPRequestHandler):
    def _set_response(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin','*')
        
        self.end_headers()

    def do_GET(self):
        logging.info("GET request,\nPath: %s\nHeaders:\n%s\n", str(self.path), str(self.headers))
        self._set_response()
        self.wfile.write("GET request for {}".format(self.path).encode('utf-8'))

    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length']) # <--- Gets the size of data
            post_data = self.rfile.read(content_length) # <--- Gets the data itself
            new_score_data = post_data.decode('utf-8')
            new_name = new_score_data.split('\n')[0]
            new_score = int(new_score_data.split('\n')[1])
            print(new_name)
            print(new_score)
            #logging.info("POST request,\nPath: %s\nHeaders:\n%s\n\nBody:\n%s\n",
            #        str(self.path), str(self.headers), post_data.decode('utf-8'))
            for i in range(len(HighScoreList)-1,-2,-1):
                if (i==-1 or new_score >= HighScoreList[i][1]):
                    if (i==9):
                        break
                    for j in range(9,i+1,-1):
                        HighScoreList[j] = HighScoreList[j-1]
                    HighScoreList[i+1] = (new_name,new_score)
                    WriteToFile()
                    break

            self._set_response()
            #for i in range
            print(HighScoreList)
            self.wfile.write(json.dumps(HighScoreList).encode('utf-8'))
        except Exception as err:
            pass

def Init():
    global HighScoreList
    try:
        with open("ScoreBoard_RPP2",'r') as f:
            HighScoreList=json.load(f)
            f.close()
    except Exception as err:
        for i in range(10):
            HighScoreList.append(("No Name",10000))
        pass
    print(HighScoreList)

def WriteToFile():
    global HighScoreList
    try:
        with open("ScoreBoard_RPP2",'w') as f:
            json.dump(HighScoreList,f)
            f.close()
    except Exception as err:
        print(err)
        pass
    


def run(server_class=HTTPServer, handler_class=S, port=8080):
    logging.basicConfig(level=logging.INFO)
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    logging.info('Starting httpd...\n')
    Init()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    logging.info('Stopping httpd...\n')

if __name__ == '__main__':
    from sys import argv

    if len(argv) == 2:
        run(port=int(argv[1]))
    else:
        run()