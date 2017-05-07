var evt_cookie_opts = {expires: 1, path: '/'};
$.cookie('evt-biz', '{{host.name}}', evt_cookie_opts);
$.cookie('evt-name', '{{event.name}}', evt_cookie_opts);
$.cookie('evt-id', '{{event.id}}', evt_cookie_opts);
