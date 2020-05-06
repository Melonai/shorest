function onFormSubmit() {
    return false;
}

function inputUpdate() {
    const pattern = /^(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?&/;
    const userInput = document.getElementById('url').value;
    if (pattern.test(userInput)) {
        document.getElementById('form-group').style.borderColor = '#E0E0E0';
    } else {
        document.getElementById('form-group').style.borderColor = '#FFBCBC';
    }
}