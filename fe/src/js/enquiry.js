$('#enq-to').text('To: ' + $.cookie('evt-biz'));
$('#enq-subject').text('Subject: About ' + $.cookie('evt-name'));

function PageVM() {
    var self = this;
    self.status = ko.observable('Send');
    self.error = ko.observable();
};

var pagevm = new PageVM();

function on_send_success(resp) {
    $('#enquiry-btn').attr('disabled', true);
    pagevm.status('Successful!');
};


function on_send_err(resp) {
    var resp = resp.responseJSON;
    pagevm.error(resp.result.msg);
    pagevm.status('Retry');
};

function on_enquiry() {
    pagevm.error('');
    var url = apihost + '/api/enquiry/';
    var data = form2json('#enquiry-form');
    data.event_id = $.cookie('evt-id');
    apipost(url, data, on_send_success, on_send_err);
};

$('form').submit( function(event) {
    pagevm.status('Sending ..');
    on_enquiry();
    return false;
});


window.onload = function() {
    //$(document).foundation();
    ko.applyBindings(pagevm);
};
