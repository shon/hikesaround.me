import puller

from flask import render_template, jsonify
from config import MANIFEST


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


def manifest():
    data = dict(
        name=MANIFEST['NAME'],
        short_name=MANIFEST['SHORT_NAME'],
        description=MANIFEST['DESCRIPTION'],
        start_url='/',
        display='standalone',
        background_color='#009688',
        lang="en_IN",
        orientation='portrait-primary',
        prefer_related_applications=True,
        theme_color='#2199e8'
    )
    data['related_applications'] = [dict(
        platform='play',
        url=(
            'https://play.google.com/store/apps/'
            'details?id=' + MANIFEST['ANDROID_APP_ID']
        ),
        id=MANIFEST['ANDROID_APP_ID']
    )]
    data['icons'] = [dict(
        sizes='300x300',
        src='http://hikesaround.me/img/logo.png',
        type='image/png'
    )]
    return jsonify(data)
