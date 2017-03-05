exports.urlEncode = function(object) {
    var encodedString = '';
    for (var prop in object) {
        if (object.hasOwnProperty(prop)) {
            if (encodedString.length > 0) {
                encodedString += '&';
            }
            encodedString += encodeURI(prop + '=' + object[prop]);
        }
    }
    return encodedString;
}

exports.removeSpace = function (str) {
    return str.replace(/\s/g, '')
};

exports.replaceSpaceWithUnderscore = function (str) {
    return str.replace(/ /g,"_")
};

exports.replaceUnderscoreWithSpace = function (str) {
    return str.replace(/_/g, " ");
};
