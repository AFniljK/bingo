var bingo = document.querySelector("#bingo");
for (var i = 0; i < 5; i++) {
    for (var j = 0; j < 5; j++) {
        var div = document.createElement("div");
        div.innerHTML = "&nbsp;";
        div.classList.add("border-amber-700", "p-4", "text-4xl", "flex", "items-center", "justify-center", "hover:bg-zinc-900");
        bingo === null || bingo === void 0 ? void 0 : bingo.appendChild(assign_border(div, i, j));
    }
}
function assign_border(div, i, j) {
    div.classList.add("border");
    if (i == 0 && j == 0) {
        div.classList.add("border-l-0", "border-t-0");
    }
    else if (i == 0 && j == 4) {
        div.classList.add("border-r-0", "border-t-0");
    }
    else if (i == 4 && j == 0) {
        div.classList.add("border-l-0", "border-b-0");
    }
    else if (i == 4 && j == 4) {
        div.classList.add("border-r-0", "border-b-0");
    }
    else {
        if (i == 0) {
            div.classList.add("border-t-0");
        }
        else if (j == 0) {
            div.classList.add("border-l-0");
        }
        else if (j == 4) {
            div.classList.add("border-r-0");
        }
        else if (i == 4) {
            div.classList.add("border-b-0");
        }
    }
    return div;
}
