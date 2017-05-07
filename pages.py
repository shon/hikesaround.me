import urllib

from flask import render_template, request
import puller

def view_trek(id):
    event = puller.cache.events_by_id[id]
    host = puller.cache.hosts[event['owner']['id']]
    return render_template('event.html', event=event, host=host)

def view_biz(id):
    host = puller.cache.hosts[id]
    return render_template('biz.html', biz=host)

def feed():
    events = puller.cache.events_sorted
    return render_template('index.html', events=events)
