import { io } from "socket.io-client"

const socket = io("/lobby");
const session = JSON.parse(getCookie("session"));
const button_holder = document.querySelector("#button_holder");
const players = document.querySelector("#players");
const heading = document.querySelector("#heading");

socket.on("connect", () => {
    console.log("connected to lobby!");
});

socket.on("master", (master) => {
    console.log(`El Master: ${master}!`);
    if (session.name == master) {
        button_holder!.innerHTML = "";
        let button = document.createElement("button");
        button.addEventListener("click", () => {
            socket.emit("start");
        });
        button.innerHTML = "Start";
        button.classList.add("w-full", "h-fit", "p-4", "text-white", "rounded-lg", "bg-green-400", "hover:bg-green-500");
        button_holder?.appendChild(button);
    }
});

socket.on("players", (data) => {
    let members = JSON.parse(data)
    players!.innerHTML = "";
    members.forEach((member: string) => {
        let li = document.createElement("li");
        li.innerHTML = member;
        players?.appendChild(li);
    });
});

socket.on("start", () => {
    window.location.href = "/play";
});

heading!.innerHTML = `Players in ${session.room}`;

window.onbeforeunload = () => {
    socket.emit("disconnect_client");
};

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