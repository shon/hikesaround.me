function PageVM() {
    var self = this;
    self.otherevents = ko.observableArray([]);
};

var pagevm = new PageVM();

function on_listother_success(resp) {
    for(var i = 0; i < resp.result.length; i++) {
        pagevm.otherevents.push(resp.result[i]);
    }
};

function list_other_treks() {
    var url = apihost + '/api/treks/others/';
    apiget(url, on_listother_success);
};

window.onload = function() {
    //$(document).foundation();
    ko.applyBindings(pagevm);
    list_other_treks();
};
