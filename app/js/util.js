exports.urlEncode = function(object) {
    var encodedString = '';
    for (var prop in object) {
        if (object.hasOwnProperty(prop)) {
            if (encodedString.length > 0) {
                encodedString += '&';
            }
            encodedString += encodeURI(prop + '=' + encodeURIComponent(object[prop]));
        }
    }
    return encodedString;
}

String.prototype.trunc =
function(n, useWordBoundary) {
  var isTooLong = this.length > n,
  s_ = isTooLong ? this.substr(0, n-1) : this;
  s_ = (useWordBoundary && isTooLong) ? s_.substr(0, s_.lastIndexOf(' ')) : s_;
  return isTooLong ? s_ + '...' : s_;
};
