"use strict";

var Life = (function () {
    var cellSizeArray = [8, 16, 32];
    var cellSizeN = 1;
    var intervalArray = [50, 100, 200, 400, 800, 2000, 5000];
    var intervalN = 3;
    var timer = null;
    var count = 0;
    var field = null; // 3 fields - previous, current, next
    var current = 0; // field[current] = current field
    var previous = 1; // field[previous] = previous field
    var next = 2; // field[next] = next field
    var width, height, pattern;

    function load() {
        var cellSize, container, x, y, f0, f1, f2, r0, r1, r2, cell, i, buttonSize, toSquare, buttons;

        cellSize = cellSizeArray[cellSizeN];
        width = Math.floor((window.innerWidth - 1) / cellSize);
        height = Math.floor((window.innerHeight - 1) / cellSize);
        container = document.getElementById("field");
        container.innerHTML = "";
        container.style.width = cellSize * width + "px";
        container.style.height = cellSize * height + "px";
        container.style.marginTop = Math.floor((window.innerHeight - 1 - cellSize * height) / 2) + "px";
        container.style.marginLeft = Math.floor((window.innerWidth - 1 - cellSize * width) / 2) + "px";
        f0 = [];
        f1 = [];
        f2 = [];
        field = [f0, f1, f2];
        for (y = 0; y < height; y++) {
            r0 = [];
            r1 = [];
            r2 = [];
            for (x = 0; x < width; x++) {
                cell = document.createElement("div");
                cell.id = "x" + x + "y" + y;
                cell.className = "cell";
                cell.style.height = cellSize - 1 + "px";
                cell.style.width = cellSize - 1 + "px";
                container.appendChild(cell);
                r0.push(false);
                r1.push(false);
                r2.push(false);
            }
            f0.push(r0);
            f1.push(r1);
            f2.push(r2);
        }

        buttonSize = Math.floor(Math.min(window.innerHeight, window.innerWidth) / 7);
        if (buttonSize > 128) {
            buttonSize = 128;
        }
        toSquare = Math.abs(window.innerHeight - window.innerWidth);
        if (buttonSize > toSquare) {
            buttonSize = toSquare > 32 ? toSquare : 32;
        }
        buttons = document.getElementsByClassName("button");
        if (window.innerHeight > window.innerWidth) {
            x = 0;
            for (i = 0; i < buttons.length; i++) {
                buttons[i].style.height = buttonSize + "px";
                buttons[i].style.width = buttonSize + "px";
                buttons[i].style.right = x + "px";
                buttons[i].style.left = null;
                buttons[i].style.top = null;
                buttons[i].style.bottom = "0px";
                x += buttonSize;
            }
        } else {
            y = 0;
            for (i = 0; i < buttons.length; i++) {
                buttons[i].style.height = buttonSize + "px";
                buttons[i].style.width = buttonSize + "px";
                buttons[i].style.right = null;
                buttons[i].style.left = "0px";
                buttons[i].style.top = y + "px";
                buttons[i].style.bottom = null;
                y += buttonSize;
            }
        }
    }

    function back() {
        if (timer !== null) {
            pause();
        }
        document.getElementById("game").style.display = "none";
        document.getElementById("main").style.display = "block";
    }

    function pause() {
        clearInterval(timer);
        timer = null;
        document.getElementById("playPause").style.backgroundImage = "url(assets/play.svg)";
    }

    function play() {
        var prevField, currentField, nextField, dead, x, y, l, r, u, d, n;
        timer = setInterval(step, intervalArray[intervalN]);
        function step() {
            prevField = field[previous];
            currentField = field[current];
            nextField = field[next];
            dead = true;
            for (y = 0; y < height; y++) {
                for (x = 0; x < width; x++) {
                    l = (x === 0) ? width - 1 : x - 1;
                    r = (x === width - 1) ? 0 : x + 1;
                    u = (y === 0) ? height - 1 : y - 1;
                    d = (y === height - 1) ? 0 : y + 1;
                    n = 0;
                    if (currentField[u][l]) {
                        n++;
                    }
                    if (currentField[u][x]) {
                        n++;
                    }
                    if (currentField[u][r]) {
                        n++;
                    }
                    if (currentField[y][l]) {
                        n++;
                    }
                    if (currentField[y][r]) {
                        n++;
                    }
                    if (currentField[d][l]) {
                        n++;
                    }
                    if (currentField[d][x]) {
                        n++;
                    }
                    if (currentField[d][r]) {
                        n++;
                    }
                    if (n === 3) {
                        nextField[y][x] = true;
                        if (!currentField[y][x]) {
                            document.getElementById("x" + x + "y" + y).style.backgroundColor = "green";
                        }
                        if (dead) {
                            dead = false;
                        }
                    } else if (n === 2 && currentField[y][x]) {
                        nextField[y][x] = true;
                        if (dead) {
                            dead = false;
                        }
                    } else {
                        nextField[y][x] = false;
                        if (currentField[y][x]) {
                            document.getElementById("x" + x + "y" + y).style.backgroundColor = null;
                        }
                    }
                }
            }
            count++;
            document.getElementById("counter").innerHTML = count;
            if (dead || isRepeated(prevField, currentField, nextField)) {
                pause();
            }
            x = previous;
            previous = current;
            current = next;
            next = x;
        }
    }

    function isRepeated(prevField, currentField, nextField) {
        var findDiffPrev, findDiffCurrent, x, y, cell;
        findDiffPrev = false;
        findDiffCurrent = false;
        for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {
                cell = nextField[y][x];
                if (!findDiffPrev && cell != prevField[y][x]) {
                    findDiffPrev = true;
                }
                if (!findDiffCurrent && cell != currentField[y][x]) {
                    findDiffCurrent = true;
                }
                if (findDiffPrev && findDiffCurrent) {
                    return false;
                }
            }
        }
        return true;
    }

    function stop() {
        if (timer !== null) {
            pause();
        }
        load();
        insertPattern();
        count = 0;
        document.getElementById("counter").innerHTML = count;
    }

    function changeCell(id) {
        if (timer !== null) {
            pause();
        }
        var x = id.slice(1, id.indexOf("y"));
        var y = id.slice(1 + id.indexOf("y"), id.length);
        if (field[current][y][x]) {
            field[current][y][x] = false;
            document.getElementById(id).style.backgroundColor = null;
        } else {
            field[current][y][x] = true;
            document.getElementById(id).style.backgroundColor = "green";
        }
    }

    function increaseSpeed() {
        if (intervalN !== 0) {
            if (intervalN === intervalArray.length - 1) {
                document.getElementById("decreaseSpeed").style.opacity = null;
            }
            intervalN--;
            if (timer !== null) {
                clearInterval(timer);
                play();
            }
            if (intervalN === 0) {
                document.getElementById("increaseSpeed").style.opacity = 0.4;
            }
        }
    }

    function decreaseSpeed() {
        if (intervalN !== intervalArray.length - 1) {
            if (intervalN === 0) {
                document.getElementById("increaseSpeed").style.opacity = null;
            }
            intervalN++;
            if (timer !== null) {
                clearInterval(timer);
                play();
            }
            if (intervalN === intervalArray.length - 1) {
                document.getElementById("decreaseSpeed").style.opacity = 0.4;
            }
        }
    }

    function increaseCell() {
        var currentField, f0, f1, f2, x, x0, y, y0, container, row, row0, cell, cellSize;
        if (cellSizeN !== cellSizeArray.length - 1) {
            if (timer !== null) {
                pause();
            }
            if (cellSizeN === 0) {
                document.getElementById("decreaseCell").style.opacity = null;
            }
            cellSizeN++;
            if (cellSizeN === cellSizeArray.length - 1) {
                document.getElementById("increaseCell").style.opacity = 0.4;
            }
            currentField = field[current];
            cellSize = cellSizeArray[cellSizeN];
            x = width;
            width = Math.floor((window.innerWidth - 1) / cellSize);
            x0 = Math.floor((x - width) / 2);
            y = height;
            height = Math.floor((window.innerHeight - 1) / cellSize);
            y0 = Math.floor((y - height) / 2);
            container = document.getElementById("field");
            container.innerHTML = "";
            container.style.width = cellSize * width + "px";
            container.style.height = cellSize * height + "px";
            container.style.marginTop = Math.floor((window.innerHeight - 1 - cellSize * height) / 2) + "px";
            container.style.marginLeft = Math.floor((window.innerWidth - 1 - cellSize * width) / 2) + "px";
            f1 = [];
            for (y = 0; y < height; y++) {
                row = [];
                for (x = 0; x < width; x++) {
                    cell = document.createElement("div");
                    cell.id = "x" + x + "y" + y;
                    cell.className = "cell";
                    cell.style.height = cellSize - 1 + "px";
                    cell.style.width = cellSize - 1 + "px";
                    container.appendChild(cell);
                    if (currentField[y0 + y][x0 + x]) {
                        row.push(true);
                        cell.style.backgroundColor = "green";
                    } else {
                        row.push(false);
                    }
                }
                f1.push(row);
            }

            f0 = [];
            f2 = [];
            for (y = 0; y < height; y++) {
                row0 = [];
                row = [];
                for (x = 0; x < width; x++) {
                    row0.push(false);
                    row.push(false);
                }
                f0.push(row0);
                f2.push(row);
            }
            field = [f0, f1, f2];
            previous = 0;
            current = 1;
            next = 2;
        }
    }

    function decreaseCell() {
        var currentField, f0, f1, f2, x, x0, xLength, y, y0, yLength, container, row, row0, cell, cellSize;
        if (cellSizeN !== 0) {
            if (timer !== null) {
                pause();
            }
            if (cellSizeN === cellSizeArray.length - 1) {
                document.getElementById("increaseCell").style.opacity = null;
            }
            cellSizeN--;
            if (cellSizeN === 0) {
                document.getElementById("decreaseCell").style.opacity = 0.4;
            }
            currentField = field[current];
            cellSize = cellSizeArray[cellSizeN];
            xLength = width;
            width = Math.floor((window.innerWidth - 1) / cellSize);
            x0 = Math.floor((width - xLength) / 2);
            yLength = height;
            height = Math.floor((window.innerHeight - 1) / cellSize);
            y0 = Math.floor((height - yLength) / 2);
            container = document.getElementById("field");
            container.innerHTML = "";
            container.style.width = cellSize * width + "px";
            container.style.height = cellSize * height + "px";
            container.style.marginTop = Math.floor((window.innerHeight - 1 - cellSize * height) / 2) + "px";
            container.style.marginLeft = Math.floor((window.innerWidth - 1 - cellSize * width) / 2) + "px";
            f1 = [];
            for (y = 0; y < height; y++) {
                row = [];
                for (x = 0; x < width; x++) {
                    cell = document.createElement("div");
                    cell.id = "x" + x + "y" + y;
                    cell.className = "cell";
                    cell.style.height = cellSize - 1 + "px";
                    cell.style.width = cellSize - 1 + "px";
                    container.appendChild(cell);
                    row.push(false);
                }
                f1.push(row);
            }

            for (y = 0; y < yLength; y++) {
                for(x = 0; x < xLength; x++) {
                    if (currentField[y][x]) {
                        f1[y0 + y][x0 + x] = true;
                        document.getElementById("x" + (x0 + x) + "y" + (y0 + y)).style.backgroundColor = "green";
                    }
                }
            }

            f0 = [];
            f2 = [];
            for (y = 0; y < height; y++) {
                row0 = [];
                row = [];
                for (x = 0; x < width; x++) {
                    row0.push(false);
                    row.push(false);
                }
                f0.push(row0);
                f2.push(row);
            }
            field = [f0, f1, f2];
            previous = 0;
            current = 1;
            next = 2;
        }
    }

    function insertPattern() {
        var x, xField0, xIns0, xLength, y, yField0, yIns0, yLength, insWidth, insHeight, insField;
        switch (pattern) {
            case "acorn":
                insWidth = 7;
                insHeight = 3;
                insField = [[false, true, false, false, false, false, false],
                            [false, false, false, true, false, false, false],
                            [true, true, false, false, true, true, true]];
                break;
            case "glider":
                insWidth = 3;
                insHeight = 3;
                insField = [[true, false, false],
                            [true, false, true],
                            [true, true, false]];
                break;
            case "switch":
                insWidth = 6;
                insHeight = 4;
                insField = [[false, true, false, true, false, false],
                            [true, false, false, false, false, false],
                            [false, true, false, false, true, false],
                            [false, false, false, true, true, true]];
                break;
            case "multum":
                insWidth = 6;
                insHeight = 4;
                insField = [[false, false, false, true, true, true],
                            [false, false, true, false, false, true],
                            [false, true, false, false, false, false],
                            [true, false, false, false, false, false]];
                break;
            case "23334m":
                insWidth = 5;
                insHeight = 8;
                insField = [[false, false, true, false, false],
                            [true, true, false, false, false],
                            [false, true, false, false, false],
                            [true, false, false, true, false],
                            [false, false, false, false, true],
                            [false, true, false, false, true],
                            [false, false, true, false, true],
                            [false, true, false, false, false]];
                break;
            case "rpentomino":
                insWidth = 3;
                insHeight = 3;
                insField = [[false, true, true],
                            [true, true, false],
                            [false, true, false]];
                break;
            case "rabbits":
                insWidth = 7;
                insHeight = 3;
                insField = [[true, false, false, false, true, true, true],
                            [true, true, true, false, false, true, false],
                            [false, true, false, false, false, false, false]];
                break;
            case "queenbee":
                insWidth = 7;
                insHeight = 5;
                insField = [[true, true, false, false, false, true, true],
                            [false, false, true, true, true, false, false],
                            [false, true, false, false, false, true, false],
                            [false, false, true, false, true, false, false],
                            [false, false, false, true, false, false, false]];
                break;
            case "7468m":
                insWidth = 6;
                insHeight = 4;
                insField = [[false, false, false, false, true, false],
                            [false, false, false, false, true, true],
                            [true, true, false, true, true, false],
                            [true, false, false, false, false, false]];
                break;
            default:
                return;
        }
        if (insWidth > width) {
            xField0 = 0;
            xIns0 = Math.floor((insWidth - width) / 2);
            xLength = width;
        } else {
            xField0 = Math.floor((width - insWidth) / 2);
            xIns0 = 0;
            xLength = insWidth;
        }
        if (insHeight > height) {
            yField0 = 0;
            yIns0 = Math.floor((insHeight - height) / 2);
            yLength = height;
        } else {
            yField0 = Math.floor((height - insHeight) / 2);
            yIns0 = 0;
            yLength = insHeight;
        }
        for (y = 0; y < yLength; y++) {
            for (x = 0; x < xLength; x++) {
                if (insField[yIns0 + y][xIns0 + x]) {
                    field[current][yField0 + y][xField0 + x] = true;
                    document.getElementById("x" + (xField0 + x) + "y" + (yField0 + y)).style.backgroundColor = "green";
                }
            }
        }
        count = 0;
        document.getElementById("counter").innerHTML = count;
    }

    return {
        start: function () {
            document.getElementById("main").style.display = "none";
            document.getElementById("game").style.display = "block";
            if (field === null) {
                load();
            }
        },
        startWith: function (newPattern) {
            var x, y;
            document.getElementById("main").style.display = "none";
            document.getElementById("game").style.display = "block";
            if (field === null) {
                load();
            } else {
                for (y = 0; y < height; y++) {
                    for (x = 0; x < width; x++) {
                        if (field[current][y][x]) {
                            field[current][y][x] = false;
                            document.getElementById("x" + x + "y" + y).style.backgroundColor = null;
                        }
                        field[previous][y][x] = false;
                    }
                }
            }
            pattern = newPattern;
            insertPattern();
        },
        onClick: function (event) {
            var id = event.target.id;
            if (id === "playPause") {
                if (timer === null) {
                    document.getElementById("playPause").style.backgroundImage = "url(assets/pause.svg)";
                    play();
                } else {
                    pause();
                }
            } else if (id === "stop") {
                stop();
            } else if (id === "increaseSpeed") {
                increaseSpeed();
            } else if (id === "decreaseSpeed") {
                decreaseSpeed();
            } else if (id === "increaseCell") {
                increaseCell();
            } else if (id === "decreaseCell") {
                decreaseCell();
            } else if (id === "back") {
                back();
            } else if (id.slice(0, 1) === "x") {
                changeCell(id);
            }
        }
    };
})();
