$(document).ready(function() {
    const form = $('#form');
    form.on('submit', onFormSubmit);
    form.attr("novalidate",true);
    $('#url').on({'input': inputUpdate, 'paste': pasteTrim});
    inputUpdate();
});

function onFormSubmit() {
    const urlField = $('#url');
    if (validateURL(urlField.val())) {
        const data = JSON.stringify({'url': 'https://' + urlField.val()});
        $.ajax('/', {method: 'POST', data: data, contentType: 'application/json'}).then(function (r) {
            urlField.val('sho.rest/' + r.hash);
        })
    }
    return false;
}

function inputUpdate() {
    const userInput = $('#url').val();
    setButtonVisible(validateURL(userInput));
}

function setButtonVisible(visible) {
    const form = $('#form');

    if (!form[0].hasAttribute('disabled') === visible) return;

    const valuesDisabled = {borderColor: '#FFBCBC', borderRight: 'none', buttonValue: '', buttonValueColor: '#FFFFFF'};
    const valuesEnabled = {borderColor: '#E0E0E0', borderRight: '', buttonValue: '→', buttonValueColor: '#727272'};

    const btn = $('#btn');
    const left = $('#left');
    const formGroup = $('#form-group');

    const values = visible ? valuesEnabled : valuesDisabled;
    if (visible) {
        const values = valuesEnabled;
        form.removeAttr('disabled');
    } else {
        const values = valuesDisabled;
        form[0].setAttribute('disabled', '');
    }

    formGroup.css('border-color', values.borderColor);
    left.css('border-right', values.borderRight);
    btn.css('color', values.buttonValueColor);
    btn.val(values.buttonValue);

}

function pasteTrim() {
    const pattern = /^https?:\/\//;
    setTimeout(() => {
        const element = $('#url');
        element.value = element.value.replace(pattern, '');
    }, 0);
}

function validateURL(url) {
    return !validate({website: 'https://' + url}, {website: {url: true}});
}