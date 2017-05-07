import base64
import datetime
import os

import dateparser
import feedparser

import settings
import apis.errors as errors

from appbase.helpers import send_email
import puller

IMAGE_DIR = settings.IMAGE_DIR

if not os.path.exists(IMAGE_DIR):
    os.makedirs(IMAGE_DIR)


def enquire(event_id, sender_name, sender_email, query):
    event = puller.cache.events_by_id[event_id]
    event_name = event['name']
    event_url = 'http://hikesaround.me/events/%s' % event['id']
    text = """Hello,\n
\n
Here is new enquiry.\n
From: %(sender_name)s <%(sender_email)s>\n
Event: %(event_name)s\n
Event URL: %(event_url)s\n
Query: %(query)s\n
\n
Best,\n
HikesAround.me """ % locals()

    subject = 'Enquiry from HikesAround.me'
    recipient = puller.cache.hosts[event['owner']['id']]['emails'][0]
    our_email = 'hello@hikesaround.me'
    send_email(our_email, recipient, subject, text, reply_to=sender_email, bcc=our_email)


def entry2dict(e):
    title = e['title']
    if title:
        print(title)
        #parsed_date = chrono.parse_date(title)
        parsed_date = dateparser.parse(title)
        if parsed_date:
            date = parsed_date.date()
            date_s = date.strftime('%b %d') if date else ''
            return {'title': title,
                    'date': date,
                    'date_s': date_s,
                    'link': e['link'] }


def memoize(f):
    results  = {}
    def memoizer(*args, **kw):
        today = datetime.date.today()
        if today in results:
            print('found')
            return results[today]
        results[today] = f(*args, **kw)
        return results[today]
    return memoizer


@memoize
def list_otherevents():
    atomurls = ['https://www.blogger.com/feeds/9034518481470438457/posts/default', 'http://www.mumbaihikers.org/feeds/posts/default']
    today = datetime.date.today()
    data = []

    for atomurl in atomurls:
        d = feedparser.parse(atomurl)
        data += [d for d in (entry2dict(e) for e in  d.entries if e) if d and d['date'] > today]

    return {'result': sorted(data, key=lambda e: e['date'])}
