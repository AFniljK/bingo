const modal = document.querySelector("dialog");
const profile: HTMLInputElement = document.querySelector("#name")!;
const room: HTMLInputElement = document.querySelector("#room")!;
const bingo: HTMLDivElement = document.querySelector("#bingo")!;
var count = 1;

if (getCookie("session") == "") {
    modal?.showModal();
}
event_listeners();

function setCookie() {
    set_cookie("session", JSON.stringify({ "name": profile.value, "room": room.value }));
}

function getCookie(cname: string) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function set_cookie(cname: string, cvalue: string) {
    document.cookie = cname + "=" + cvalue + ";path=/";
}

function event_listeners() {
    for (let i = 0; i < bingo.children.length; i++) {
        let div = bingo.children[i];

        div.addEventListener("mouseover", () => {
            if (div.classList.contains("clicked")) {
                return;
            }
            div.innerHTML = `${count}`;
        });

        div.addEventListener("mouseout", () => {
            if (div.classList.contains("clicked")) {
                return;
            }
            div.innerHTML = "&nbsp;";
        });

        div.addEventListener("click", () => {
            if (div.classList.contains("clicked")) {
                return;
            }
            div.classList.add("clicked");
            count++;
            let nulls = 0;
            numbers().forEach(number => {
                if (isNaN(number)) {
                    nulls++;
                }
            });
            if (nulls == 0) {
                set_cookie("numbers", JSON.stringify(numbers()));
                window.location.href = "/lobby";
            }
        });
    }
}

function numbers() {
    let values: number[] = [];
    for (let i = 0; i < bingo.children.length; i++) {
        values.push(parseInt(bingo.children[i].innerHTML));
    }
    return values;
}