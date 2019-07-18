from bottle import route, run, template, static_file, request, response, redirect, TEMPLATE_PATH
import os
import pymysql
import json
import sqlite3

TEMPLATE_PATH.insert(0, os.path.dirname(__file__))

google_route_data = {}
origin = {}
destination = {}


@route('/gatherRouteData',method="POST")
def gatherRouteData():
    conn = sqlite3.connect('routeDB.sqlite')
    cur = conn.cursor()
    data = request.POST.get('route')
    google_route_data['data'] = json.loads(data)
    cur.executescript('''
    Drop Table If Exists WALKING;
    Drop Table If Exists BICYCLING;
    Drop Table If Exists DRIVING;
    Drop Table If Exists TRANSIT;
    Drop Table If Exists TWO_WHEELER;
    Create Table WALKING (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, lat DECIMAL(4,3), lng DECIMAL(4,3));
    Create Table BICYCLING (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, lat DECIMAL(4,3), lng DECIMAL(4,3));
    Create Table DRIVING (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, lat DECIMAL(4,3), lng DECIMAL(4,3));
    Create Table TRANSIT (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, lat DECIMAL(4,3), lng DECIMAL(4,3));
    Create Table TWO_WHEELER (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, lat DECIMAL(4,3), lng DECIMAL(4,3));
    ''')
    for data in google_route_data['data']:
        for loc in data:
            for lo in data[loc]:
                lat = lo['lat']
                lng = lo['lng']
                cur.execute('Insert Into {0} Values (null,{1},{2})'.format(loc,lat,lng))
    conn.commit()
    cur.close()

@route('/newRoute')
def newRoute():
    mode = "WALKING"
    conn = sqlite3.connect('routeDB.sqlite')
    cur = conn.cursor()
    cur.execute('Select lat,lng From {}'.format(mode))
    result = cur.fetchall()
    return json.dumps(result)

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