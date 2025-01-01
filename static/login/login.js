var modal = document.querySelector("dialog");
var profile = document.querySelector("#name");
var room = document.querySelector("#room");
var bingo = document.querySelector("#bingo");
var count = 1;
if (getCookie("session") == "") {
    modal === null || modal === void 0 ? void 0 : modal.showModal();
}
event_listeners();
function setCookie() {
    set_cookie("session", JSON.stringify({ "name": profile.value, "room": room.value }));
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function set_cookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";path=/";
}
function event_listeners() {
    var _loop_1 = function (i) {
        var div = bingo.children[i];
        div.addEventListener("mouseover", function () {
            if (div.classList.contains("clicked")) {
                return;
            }
            div.innerHTML = "".concat(count);
        });
        div.addEventListener("mouseout", function () {
            if (div.classList.contains("clicked")) {
                return;
            }
            div.innerHTML = "&nbsp;";
        });
        div.addEventListener("click", function () {
            if (div.classList.contains("clicked")) {
                return;
            }
            div.classList.add("clicked");
            count++;
            var nulls = 0;
            numbers().forEach(function (number) {
                if (isNaN(number)) {
                    nulls++;
                }
            });
            if (nulls == 0) {
                set_cookie("numbers", JSON.stringify(numbers()));
                window.location.href = "/lobby";
            }
        });
    };
    for (var i = 0; i < bingo.children.length; i++) {
        _loop_1(i);
    }
}
function numbers() {
    var values = [];
    for (var i = 0; i < bingo.children.length; i++) {
        values.push(parseInt(bingo.children[i].innerHTML));
    }
    return values;
}
