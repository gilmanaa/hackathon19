from bottle import route, run, template, static_file, request, response, redirect, TEMPLATE_PATH
import os
import pymysql
import json

TEMPLATE_PATH.insert(0, os.path.dirname(__file__))

google_route_data = {}
origin = {}
destination = {}

@route('/gatherRouteData',method="POST")
def gatherRouteData():
    data = request.POST.get('route')
    google_route_data['data'] = json.loads(data)

@route('/map')
def map():
    return template('./map.html')

@route('/')
def index():
    return template('./index.html')

@route('/<filename:re:.*\.css>')
def styles(filename):
    return static_file(filename, root="")

@route('/<filename:re:.*\.js>')
def javascripts(filename):
    return static_file(filename, root="")

@route('/<filename:re:.*\.(jpg|jpeg|png|gif|ico)>')
def images(filename):
    return static_file(filename, root="")

def main():
    run(host='localhost', port=7000)

if __name__ == '__main__':
    main()