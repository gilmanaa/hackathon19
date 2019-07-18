from bottle import route, run, template, static_file, request, response, redirect, TEMPLATE_PATH
import os
import pymysql
import json
import sqlite3
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

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

@route('/newRoute',method="POST")
def newRoute():
    mode = request.POST.get('mode')
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


'''
df = pd.read_csv('Chicago_Crimes_2012_to_2017.csv')
df.drop(
    ['Block', 'Updated On', 'Year', 'Unnamed: 0', 'ID', 'Case Number', 'Date', 'IUCR', 'Description', 'Arrest', 'Ward',
     'Community Area'], axis=1, inplace=True)

street_crime = ['STREET',
                'SIDEWALK',
                'PARKING LOT/GARAGE(NON.RESID.)',
                'ALLEY',
                'RESIDENTIAL YARD (FRONT/BACK)',
                'RESTAURANT',
                'RESIDENCE-GARAGE',
                'RESIDENCE PORCH/HALLWAY',
                'VEHICLE NON-COMMERCIAL',
                'GAS STATION',
                'PARK PROPERTY',
                'CTA PLATFORM',
                'CTA TRAIN',
                'VACANT LOT/LAND',
                'SCHOOL, PUBLIC, GROUNDS',
                'CTA BUS',
                'POLICE FACILITY/VEH PARKING LOT',
                'CHA PARKING LOT/GROUNDS',
                'ABANDONED BUILDING',
                'DRIVEWAY - RESIDENTIAL',
                'CTA BUS STOP',
                'CTA GARAGE / OTHER PROPERTY',
                'ATM (AUTOMATIC TELLER MACHINE)',
                'CURRENCY EXCHANGE',
                'TAXICAB',
                'CTA STATION',
                'CONSTRUCTION SITE',
                'SPORTS ARENA/STADIUM',
                'VEHICLE-COMMERCIAL',
                'OTHER RAILROAD PROP / TRAIN DEPOT',
                'COLLEGE/UNIVERSITY GROUNDS',
                'SCHOOL, PRIVATE, GROUNDS',
                'DAY CARE CENTER',
                'OTHER COMMERCIAL TRANSPORTATION',
                'CAR WASH',
                'MOVIE HOUSE/THEATER',
                'AIRPORT PARKING LOT',
                'COLLEGE/UNIVERSITY RESIDENCE HALL',
                'LAKEFRONT/WATERFRONT/RIVERBANK',
                'AUTO',
                'HIGHWAY/EXPRESSWAY',
                'VEHICLE - OTHER RIDE SERVICE',
                'BRIDGE',
                'PORCH',
                'CEMETARY',
                'YARD',
                'DELIVERY TRUCK']

df_street = df[df['Location Description'].isin(street_crime)]
df_street = df_street[df_street['Domestic'] == False]
df_street.index = [i for i in range(len(df_street))]

data = df_street.loc[:2000]


def crime_around(kind_crime, df, route):
    def distance(p1, p2):
        return (p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2

    pts_route = np.zeros((len(route), 2))
    for i in range(len(route)):
        pts_route[i, 0] = route[i]['lat']
        pts_route[i, 1] = route[i]['lng']

    data = df.groupby('Primary Type').get_group(kind_crime)
    data_lat = data.Latitude.values
    data_lng = data.Longitude.values
    data_pts = np.column_stack((data_lat, data_lng))

    p_crime = []
    for p in pts_route:
        for d in data_pts:
            if distance(p, d) <= 0.01:
                p_crime.append(d)
    return np.array(p_crime).reshape(len(p_crime), 2)


# example
crime_around('BATTERY', data, route)
'''