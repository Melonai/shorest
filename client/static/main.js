$(document).ready(function() {
    const FORM = $('#form');
    const URL_FIELD = $('#url');

    FORM.on('submit', onFormSubmit);
    FORM.attr("novalidate",true);
    URL_FIELD.on({'input': inputUpdate, 'paste': pasteTrim});

    function onFormSubmit() {
        if (validateURL(URL_FIELD.val())) {
            const data = JSON.stringify({'url': 'https://' + URL_FIELD.val()});
            $.ajax('/', {method: 'POST', data: data, contentType: 'application/json'}).then(onSuccess);
        }
        return false;
    }

    function onSuccess(response) {
        const responseDiv = $('#response-template')[0].content.querySelector('div');
        const node = document.importNode(responseDiv, true);
        let text;
        if (URL_FIELD.val().length < 20 ) {
            text = 'The short link for <strong>' + URL_FIELD.val() + '</strong> is<br><strong>sho.rest/' + response.hash + '</strong>';
        } else {
            text = 'The short link for your URL is<br><strong>sho.rest/' + response.hash + '</strong>';
        }
        node.querySelector('.response-text').innerHTML = text;
        $(node).find('.copy-text').on('click', copyClick);
        $('#responses')[0].prepend(node);
    }

    function inputUpdate() {
        const visible = validateURL(URL_FIELD.val())
        if (!FORM[0].hasAttribute('disabled') === visible) return;

        const valuesDisabled = {borderColor: '#FFBCBC', borderRight: 'none', buttonValue: '', buttonValueColor: '#FFFFFF'};
        const valuesEnabled = {borderColor: '#E0E0E0', borderRight: '', buttonValue: '→', buttonValueColor: '#727272'};

        const btn = $('#btn');
        const left = $('#left');
        const formGroup = $('#form-group');

        let values;
        if (visible) {
            values = valuesEnabled;
            FORM.removeAttr('disabled');
        } else {
            values = valuesDisabled;
            FORM[0].setAttribute('disabled', '');
        }

        formGroup.css('border-color', values.borderColor);
        left.css('border-right', values.borderRight);
        btn.css('color', values.buttonValueColor);
        btn.val(values.buttonValue);
    }

    function pasteTrim() {
        const pattern = /^https?:\/\//;
        setTimeout(() => {
            URL_FIELD.val(URL_FIELD.val().replace(pattern, ''));
            inputUpdate();
        }, 0);
    }

    inputUpdate();
});

function copyClick(event) {
    const target = $(event.target);
    if (target.hasClass('copied')) return;
    const copyText = target.closest('.copy-text');
    const previousCopied = $('.copied');

    previousCopied.removeClass('copied');
    previousCopied.html('<strong>Copy Link</strong>');
    copyText.html('Link Copied!');
    copyText.addClass('copied');

    const link = copyText.parent().find('.response-text strong').last();

    const range = document.createRange();
    range.selectNode(link[0]);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
}

function validateURL(url) {
    return !validate({website: 'https://' + url}, {website: {url: true}});
}