$(document).ready(function() {
    $('#form').on('submit', onFormSubmit);
    $('#url').on({'input': inputUpdate, 'paste': pasteTrim});
});

function onFormSubmit() {
    const urlField = document.getElementById('url');
    const data = JSON.stringify({'url': 'https://' + urlField.value});
    $.ajax('/', {method: 'POST', data: data, contentType: 'application/json'}).then(function (r) {
        urlField.value = 'sho.rest/' + r.hash;
    })
    return false;
}

function inputUpdate() {
    const userInput = document.getElementById('url').value;
    if (!validate({website: 'https://' + userInput}, {website: {url: true}})) {
        $('#form-group').css('border-color', '#E0E0E0');
    } else {
        $('#form-group').css('border-color', '#FFBCBC');
    }
}

function pasteTrim() {
    const pattern = /^https?:\/\//;
    setTimeout(() => {
        const element = $('#url');
        element.value = element.value.replace(pattern, '');
    }, 0);
}