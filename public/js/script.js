/* global $ */
/* global location*/

$(".btn-shorten").click(function() {
    var text = $('#url-field').val();
    window.location.replace("new/" + text);
});
