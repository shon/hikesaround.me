import datetime
import pickle
import os.path

import facebook
import requests
import dateutil.parser

import fbdata

from settings import FACEBOOK_APP_ID, FACEBOOK_APP_SECRET


def get_app_access_token(app_id, app_secret):
    params = {'grant_type': 'client_credentials',
            'client_id': app_id,
            'client_secret': app_secret}
    resp = requests.get('https://graph.facebook.com/oauth/access_token', params=params).json()
    return resp['access_token']


token = get_app_access_token(FACEBOOK_APP_ID, FACEBOOK_APP_SECRET)
graph = facebook.GraphAPI(access_token=token)

event_fields = 'description, start_time, place, end_time, id, name, owner'
host_fields = 'name, id, phone, website, link, location, emails, cover, about, company_overview'


class cache:
    events_by_id = {}
    events_sorted = []
    events_by_host = {}
    hosts = {}

try:
    d = pickle.load(open('.cache', 'rb'))
    cache.events_sorted = d['events_sorted']
    cache.events_by_id = d['events_by_id']
    cache.events_by_host = d['events_by_host']
    cache.hosts = d['hosts']
except Exception as err:
    print(err)


def get_picture_url(oid):
    try:
        return graph.get_object(oid, fields=['cover'])['cover']['source']
    except:
        return None


def get_object(oid, fields=None):
    print('get_object: ', oid)
    if not fields:
        o = graph.get_object(oid)
    else:
        o = graph.get_object(oid, fields=fields)
    if 'start_time' in o:
        o['start_time'] = dateutil.parser.parse(o['start_time'], ignoretz=True)
        o['end_time'] = dateutil.parser.parse(o['end_time'], ignoretz=True) if o.get('end_time') else o['start_time']
        assert isinstance(o['end_time'], (datetime.datetime, datetime.date))
        o['picture_url'] = get_picture_url(oid)
        #print(o['name'], o['picture_url'])
    return o


def pull_events(fbid, limit=100):
    result = graph.get_connections(fbid, 'events')
    events = result['data']
    while True:
        has_next = 'paging' in result and 'next' in result['paging']
        if has_next:
            result = requests.get(result['paging']['next']).json()
            events += result['data']
        if ((not has_next) or (len(events) >= limit)):
            break
    events = [get_object(item['id'], event_fields) for item in events]
    return len(events), events


def pull_all_events(start=None, end=None):
    """
    @start, @end: mainly for testing
    """
    events_by_host = {}
    all_events = []
    hosts = {}
    now = datetime.datetime.now()
    before_date = now + datetime.timedelta(60)
    for fbid in fbdata.PAGES[start:end]:
        try:
            host = get_object(fbid, host_fields)
            print(fbid, host['id'])
            hosts[host['id']] = host
            count, events = pull_events(fbid, limit=15)
            print('found %d events' % count)
            events = [e for e in events if before_date > e['start_time'] > now]
            print('found %d future events' % len(events))
            events_by_host[fbid] = events
            all_events += events
        except Exception as err:
            print('pull_events failed: [%s]' % fbid)
            print(err)
    cache.events_sorted = sorted(all_events, key=lambda e: e['start_time'])
    cache.events_by_id = dict((e['id'], e) for e in all_events)
    cache.events_by_host = events_by_host
    cache.hosts = hosts
    pickle.dump({'events_sorted': cache.events_sorted,
                 'events_by_id': cache.events_by_id,
                 'events_by_host': cache.events_by_host,
                 'hosts': hosts},
                open('.cache', 'wb'))
