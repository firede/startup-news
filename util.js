var CREATE_DATE_PATTERN = /\d{1,2}\s\w+\sago/;

exports.extractCreateDate = function (str) {
    if (typeof str === 'string' && str !== '') {
        var matched = CREATE_DATE_PATTERN.exec(str);

        if (matched && matched.length > 0) {
            return matched[0];
        }
        else {
            return '';
        }
    }
};
