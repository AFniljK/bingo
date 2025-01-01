import { io } from "socket.io-client";

const bingo = document.querySelector("#bingo")!;
const heading = document.querySelector("#heading");
const values = JSON.parse(getCookie("numbers"));
const session = JSON.parse(getCookie("session"));
const pattern = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
];
var turn = false;
var matches = 0;
var diagonall = false;
var diagonalr = false;

for (let i = 0; i < bingo.children.length; i++) {
    bingo.children[i].innerHTML = values[i];
}

const socket = io("/play");

socket.on("connect", () => {
    console.log("connected to the server!");
});

socket.on("cross", number => {
    let index = values.indexOf(number);
    let div = bingo.children[index];
    div.classList.remove("hover:bg-zinc-900");
    div.classList.add("bg-rose-400");
    let i = row(index);
    let j = col(index);
    pattern[i][j] = 1;
    check_pattern(i, j);
});

socket.on("turn", (member) => {
    console.log("Turn:", member);
    if (session.name == member) {
        heading!.innerHTML = "Your Turn!";
        turn = true;
    } else {
        heading!.innerHTML = `${member}'s Turn!`;
        turn = false;
    }
});

socket.on("winner", winner => {
    if (session.name == winner) {
        window.location.href = "/winner";
    } else {
        window.location.href = "/loser";
    }
});

socket.on("disconnect", () => {
    console.log("disconnected from the server!");
})

for (let i = 0; i < bingo.children.length; i++) {
    let div = bingo.children[i];
    div.addEventListener("click", () => {
        if (!turn) {
            return;
        }
        socket.emit("cross", parseInt(div.innerHTML));
        turn = false;
    });
}

function check_pattern(row: number, col: number) {
    matching_row(row);
    matching_col(col);
    if (row == col) {
        matching_diagonall();
    }
    if ((row + col) == 4) {
        matching_diagonalr();
    }
    if (matches >= 5) {
        socket.emit("winner", session.name);
    }
}

function matching_row(row: number) {
    let res = 1;
    for (let i = 0; i < 5; i++) {
        res *= pattern[row][i];
    }
    if (Boolean(res)) {
        for (let i = 1; i <= 5; i++) {
            let index = row * 5 + i;
            bingo.children[index - 1].classList.add("bg-green-300");
        }
        matches++;
    }
}

function matching_col(col: number) {
    let res = 1;
    for (let i = 0; i < 5; i++) {
        res *= pattern[i][col];
    }
    if (Boolean(res)) {
        for (let i = 0; i < 5; i++) {
            let index = i * 5 + col;
            bingo.children[index].classList.add("bg-green-300");
        }
        matches++;
    }
}

function matching_diagonall() {
    let res = 1;
    for (let i = 0; i < 5; i++) {
        res *= pattern[i][i];
    }
    if (Boolean(res)) {
        for (let i = 0; i < 5; i++) {
            let index = i * 5 + i;
            bingo.children[index].classList.add("bg-green-300");
        }
        matches++;
    }
}

function matching_diagonalr() {
    let res = 1;
    for (let i = 0; i < 5; i++) {
        res *= pattern[i][4 - i];
    }
    if (Boolean(res)) {
        for (let i = 0; i < 5; i++) {
            let index = i * 5 + 4 - i;
            console.log(index, i);
            bingo.children[index].classList.add("bg-green-300");
        }
        matches++;
    }
}

function col(index: number) {
    if (index < 5) {
        return index;
    }
    return index % 5;
}

function row(index: number) {
    if (index <= 4) {
        return 0;
    }
    return Math.floor(index / 5);
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