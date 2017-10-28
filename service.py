import sys
sys.path.append('.')
import appbase.bootstrap as bootstrap

from flask import Flask
from gevent.pywsgi import WSGIServer

bootstrap.use_gevent()

from appbase.publishers import HTTPPublisher
from appbase.flaskutils import support_datetime_serialization

import apis.treks as trekapis
import puller
import pages


def set_routes(app):
    http_publisher = HTTPPublisher(app)

    http_publisher.add_mapping('/api/treks/others/', trekapis.list_otherevents, ['GET'])
    http_publisher.add_mapping('/api/enquiry/', trekapis.enquire, ['POST'])
    http_publisher.add_mapping('/echo/<x>', lambda x: x)

    app.add_url_rule('/events/<id>', None, pages.view_trek, methods=['GET'])
    app.add_url_rule('/biz/<id>', None, pages.view_biz, methods=['GET'])
    app.add_url_rule('/manifest.json', None, pages.manifest, methods=['GET'])
    app.add_url_rule('/', None, pages.feed, methods=['GET'])


def make_app():
    import settings
    app = Flask(__name__, static_url_path='', static_folder='./fe/dist', template_folder='./fe/dist')
    app = support_datetime_serialization(app)
    app.debug = settings.DEBUG
    bootstrap.configure_logging('app.log', settings.DEBUG)
    set_routes(app)
    return app

if __name__ == '__main__':
    conf = sys.argv[1:2] and sys.argv[1:2][0] or 'dev'
    app = make_app()
    host = '0.0.0.0'
    default_port = 8000
    port = (sys.argv[1:2] and sys.argv[1:2] and int(sys.argv[1])) or default_port
    #app.run(host, port, debug=True)  # usual flask
    http = WSGIServer(('', port), app)  # gevent
    print('starting server on %s:%s' % (host, port))
    http.serve_forever()
