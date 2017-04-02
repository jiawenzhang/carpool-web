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

exports.isWeChatBrowser = function () {
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
        return true;
    } else {
        return false;
    }
}

exports.proximateTime = function (startTime, endTime) {
    if (startTime.hours() == 0 && endTime.hours() == 12) {
      return "Morning";
    } else if (startTime.hours() == 12 && endTime.hours() == 18) {
      return "Afternoon";
    } else if (startTime.hours() == 18 && endTime.hours() == 23) {
      return "Evening";
    } else if (startTime.hours() == 0 && endTime.hours() == 23) {
      return "Any time";
    }
    return null
}
