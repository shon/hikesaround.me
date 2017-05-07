var apihost = '';

function iso2date(iso) {
    var dt = new Date(iso.slice(0, 10).split('-'));
    return dt;
};

function form2json(selector) {
    var array = $(selector).serializeArray();
    var form_json = {};
    $.each(array, function(i, field) {
        var value = field.value;
        var name = field.name.split(':')[0]
        var type = field.name.split(':')[1]
        console.log([name, type]);
        if (type == 'float') {
            value = parseFloat(value, 10);
        } else if (type == 'int') {
            value = parseInt(value, 10);
        };
        if (form_json.hasOwnProperty(name) == true) {
            if (typeof(form_json[name]) == 'object') {
                form_json[name].push(value);
            } else {
                form_json[name] = [form_json[name], value];
            };
        } else {
            form_json[name] = value;
        };
    });
    $('form input[type=file]').each(function(i, field) {
        console.log('retrieving value for: ' + form_json[field.name]);
        form_json[field.name] = input_file_values[field.name];
    });
    return form_json;
};
            

var input_file_values = {};
var image_size_limit = (2048 * 1024);

$(document).on('change', 'form input[type=file]', function handleFileSelect(evt) {
    var name = evt.target.name;
    console.log('input change fired: ' + name);
    var files = evt.target.files;
    var reader = new FileReader();
    reader.onload = (function(e) {
        input_file_values[name]= e.target.result;
        console.log('stored value for: ' + name);
    }); 
    if (files.length == 1) { 
        if (files[0].size <= image_size_limit) {
            reader.readAsDataURL(files[0]);
        } else {
            alert("Image size exceeds image upload limit, Image size must be less than "+ (image_size_limit/1000) + "kb.");
        }
    };   
});

function global_ajax_cursor_change() {
    $("html").bind("ajaxStart", function() {
        $(this).addClass('busy');
    }).bind("ajaxStop", function() {
        $(this).removeClass('busy');
   });
};

function apiget(url, on_success, on_err) {
    var data = JSON.stringify(data);
    $.ajax({
        url: url,
        type: 'GET',
        success: on_success,
        error: on_err,
        dataType: 'json'
    });
};

function apipost(url, data, on_success, on_err) {
    data = JSON.stringify(data);
    $.ajax({
        url: url,
        data: data,
        type: 'POST',
        success: on_success,
        error: on_err,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8'
    });
};


function login(email, password, post_login, post_login_err) {
    var url = apihost + '/api/users/sessions/';
    var data = {email: email, password: password};
    var _on_login = function (resp) {
        console.log(resp);
        $.cookie('session_id', resp.result); 
        post_login();
    };
    var _on_login_err = function (resp) {
        post_login_err(resp.responseJSON);
    };
    apipost(url, data, _on_login, _on_login_err);
};

// bootstrap
if (!Modernizr.inputtypes.date) {
    webshim.setOptions('forms-ext', {
        replaceUI: 'auto'
    });
    webshim.polyfill('forms forms-ext');
};
