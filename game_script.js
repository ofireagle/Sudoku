var mat; // the full table
const N = 9; // number of columns/rows. 
const SRN = parseInt(Math.sqrt(N)); // square root of N
var mat0; // the table after reducing numbers

var audio;

var levelGame; //the level of the game - easy (1), medium (2), hard (3).

var gameOver = false; // a flag represents if we finished the game

// Sudoku Generator 
function fillValues() {
    mat = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
    // Fill the diagonal of SRN x SRN matrices 
    fillDiagonal();
    // Fill remaining blocks 
    fillRemaining(0, SRN);
    // Remove Randomly K digits to make game 
}

// Fill the diagonal SRN x SRN matrices 
function fillDiagonal() {
    let num;
    for (let i = 0; i < N; i++) { //fill the diagonl
        do {
            num = randomGenerator(N);
        }
        while (!unUsedInDiagonal(num)); //chooses a number randomly which is not already appears.

        mat[i][i] = num; //enters the randomly num to the mat
    }
    for (let i = 0; i < N; i = i + SRN) { //fill the blocks of the diagonal
        // for diagonal box, start coordinates->i==j 
        fillBox(i, i);
    }
}

// Returns false if given 3 x 3 block contains num. 
function unUsedInBox(rowStart, colStart, num) {
    for (let i = 0; i < SRN; i++)
        for (let j = 0; j < SRN; j++)
            if (mat[rowStart + i][colStart + j] == num)
                return false;

    return true;
}

// Returns false the diagonal contains num. 
function unUsedInDiagonal(num) {
    for (let i = 0; i < N; i++) {
        if (mat[i][i] == num)
            return false;
    }
    return true;
}

// Fill a 3 x 3 matrix with random nums.
function fillBox(row, col) {
    let num;
    for (let i = 0; i < SRN; i++) {
        for (let j = 0; j < SRN; j++) {
            if (i != j) { // the diagonal is already full
                do {
                    num = randomGenerator(N);
                }
                while (!unUsedInBox(row, col, num)); //chooses a number randomly which is not already appears.

                mat[row + i][col + j] = num; //enters the randomly num to the mat
            }
        }
    }
}

// Random generator 
function randomGenerator(num) {
    return parseInt(Math.floor((Math.random() * num + 1)));
}

// Check if safe to put in cell 
function CheckIfSafe(i, j, num) {
    return (unUsedInRow(i, num) &&
        unUsedInCol(j, num) &&
        unUsedInBox(i - i % SRN, j - j % SRN, num));
}

// check in the row for existence 
function unUsedInRow(i, num) {
    for (let j = 0; j < N; j++)
        if (mat[i][j] == num)
            return false;
    return true;
}

// check in the col for existence 
function unUsedInCol(j, num) {
    for (let i = 0; i < N; i++)
        if (mat[i][j] == num)
            return false;
    return true;
}

// A recursive function to fill remaining mat
function fillRemaining(i, j) {
    //checks about the validity of i and j
    if (j >= N && i < N - 1) {
        i = i + 1;
        j = 0;
    }
    if (i >= N && j >= N)
        return true;

    if (i < SRN) {
        if (j < SRN)
            j = SRN;
    }
    else if (i < N - SRN) {
        if (j == parseInt(i / SRN) * SRN)
            j = j + SRN;
    }
    else {
        if (j == N - SRN) {
            i = i + 1;
            j = 0;
            if (i >= N)
                return true;
        }
    }

    for (let num = 1; num <= N; num++) { //try to enter numbers recursivly
        if (CheckIfSafe(i, j, num)) {
            mat[i][j] = num;
            if (fillRemaining(i, j + 1))
                return true;

            mat[i][j] = 0;
        }
    }
    return false;
}

//Deletes numbers from the mat according to the level that was chosen
function reduceNumbers() {
    fillValues();
    mat0 = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
    for (let i = 0; i < 9; i++) // copies mat to mat0
        for (let j = 0; j < 9; j++)
            mat0[i][j] = mat[i][j];
    let numdel; // the number of nums to delete
    if (levelGame == 1) // easy level
        numdel = 20;
    else if (levelGame == 2) // medium level
        numdel = 40;
    else // hard and challenge level
        numdel = 60;
    for (let i = 0; i < numdel; i++) { // randomize the location of the num to delete from mat0
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        if (mat0[row][col] == 0) // if the num in this location is already deleted then do the iteration again
            i--;
        else
            mat0[row][col] = 0;

    }
}

//fill the visual table with mat0 and colors the cells accordingly
function fillTable() {
    let strId = "";
    for (let i = 0; i < 9; i++)
        for (let j = 0; j < 9; j++) {
            strId = "cell" + i + "" + j;
            if (mat0[i][j] != 0) {
                document.getElementById(strId).value = mat0[i][j];
                document.getElementById(strId).disabled = true;
                document.getElementById(strId).style.backgroundColor = 'rgba(255, 255, 255, 0.473)';
            }
            else {
                document.getElementById(strId).value = "";
                document.getElementById(strId).disabled = false;
                document.getElementById(strId).style.backgroundColor = 'transparent';
            }
        }
}

//Fills the visual table with the full mat
function solveGame() {
    for (let i = 0; i < 9; i++)
        for (let j = 0; j < 9; j++) {
            strId = "cell" + i + "" + j;
            document.getElementById(strId).value = mat[i][j];
            document.getElementById(strId).disabled = true;
        }
}

//Creates the visual table
function createTable() {
    for (let i = 0; i < 9; i++) {
        r = document.createElement('tr');
        r.setAttribute("id", "tr" + i);
        document.getElementById("table").appendChild(r); // creates a tr
        for (let j = 0; j < 9; j++) {
            strId = "td" + i + "" + j;
            d = document.createElement('td');
            d.setAttribute("id", strId);
            document.getElementById("tr" + i).appendChild(d); // creates a td
            strId = "cell" + i + "" + j;
            n = document.createElement('input');
            n.setAttribute("id", strId);
            n.onkeyup = function () { cellEntered(i, j) }; // creates an event to the input
            n.autocomplete = "off";
            document.getElementById("td" + i + "" + j).appendChild(n); // creates an input
        }
    }
}

//Manages the web after the level has choosen
function chooseLevel(level) {
    document.getElementById("songs").style.display = "block"; // shows the selection of music
    audio = new Audio('Jazz.mp3'); // plays jazz
    audio.play();
    levelGame = level; // saves the level number in the global variable
    document.getElementById("difficulty").style.display = "none";
    document.getElementById("level").style.display = "none";
    document.getElementById("game").style.display = "block";
    document.getElementById("timer").style.display = "block";
    createTable();
    reduceNumbers();
    fillTable();
    if (levelGame == 4) // set the timer in case of challenge
        totalSeconds = 900;
    setInterval(setTime, 1000); // starts the timer
}

//Starts a new game
function newGame() {
    reduceNumbers();
    fillTable();
    if (levelGame == 4) // set the timer in case of challenge
        totalSeconds = 900;
    else
        totalSeconds = 0; // equates the timer to zero 
    totalHours = 0;
    document.getElementById("victory").style.display = "none";
    document.getElementById("game").style.display = "block";
    document.getElementById("timer").style.display = "block";
}

//When the user enters a cell, check what char was entered and deletes it if it's not 1-9
function cellEntered(row, col) {
    let strId = "cell" + row + "" + col;

    if (document.getElementById(strId).value < '0' || document.getElementById(strId).value > '9')
        document.getElementById(strId).value = "";
    else if (document.getElementById(strId).value.length > 1)
        document.getElementById(strId).value = document.getElementById(strId).value[1];
    document.getElementById("cell" + row + "" + col).style.backgroundColor = "Transparent";
}

//Reveals a num in a randomly location in the visual table
function getHint() {
    let row, col, strId, hasEmpty = false;
    //firstly checks that the table is not full
    for (let i = 0; i < 9; i++)
        for (let j = 0; j < 9; j++) {
            strId = "cell" + i + "" + j;
            if (document.getElementById(strId).value == "") {
                hasEmpty = true;
                break;
            }
        }
    if (hasEmpty)
        while (true) { // randomize the location till we finds an empty cell 
            row = Math.floor(Math.random() * 9);
            col = Math.floor(Math.random() * 9);
            strId = "cell" + row + "" + col;
            if (document.getElementById(strId).value == "") {
                document.getElementById(strId).value = mat[row][col];
                document.getElementById(strId).disabled = true;
                document.getElementById(strId).style.backgroundColor = 'rgba(255, 255, 255, 0.473)';
                return;
            }
        }
    else
        alert("The whole table is full.")
}

//When the user clicked on "finish" button
function endGame() {
    flag = false; // stops the timer
    if (!checkTable()) { // checks the table, if there is a wrong numer then
        if (totalSeconds == 0) // if the user lost in the challenge
            alert("Oh, the time is over :( \nTry again!");
        else { // regular wrong
            alert("Wrong");
            flag = true; // continues the timer
        }
        return;
    }
    else {  // the table is correct
        gameOver = true;
        flag = true;
        document.getElementById("game").style.display = "none";
        document.getElementById("timer").style.display = "none";
        document.getElementById("victory").style.display = "block";
        document.getElementById("startOver").style.display = "block";
        if (levelGame == 4)
            return;
        enterTableRecords();
    }
}

//check the timer and if it's a record, enters the results to the records table
function enterTableRecords() {
    createJSON(); // initiate a json of records
    let time = document.getElementById("hours").innerText + document.getElementById("minutes").innerText + document.getElementById("seconds").innerText;
    time = parseInt(time); // converts the time into integer
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy; // a string of the date
    let j; // according the level, decides in which json we are 
    if (levelGame == 1)
        j = "records1JSON";
    else if (levelGame == 2)
        j = "records2JSON";
    else
        j = "records3JSON";
    let text = localStorage.getItem(j);
    var obj = JSON.parse(text); //converts json to an object
    for (let i = 0; i < obj.length; i++) { // runs over the array
        if (obj[i].time > time || obj[i].time == "") { // if the actual time is smaller than the one in the json
            obj.splice(i, 0, { date: today, time: time }); // enters the details in the correct place in the array
            if (obj.length >= 6) // the record list contains only 5 records
                obj.pop();
            myJSON = JSON.stringify(obj);
            localStorage.setItem(j, myJSON); // udates the json
            document.getElementById("enterTable").style.display = "block";
            return;
        }
    }
    alert("Unfortunately, you have not entered to the record list");
}

//creates 3 json files
function createJSON() {
    for (let i = 1; i < 4; i++) {
        text = localStorage.getItem("records" + i + "JSON");
        var objArr = JSON.parse(text);
        if (objArr == null) { // checks if there is a value in the json, if not then
            var myObj = { date: "", time: "" }; // creates an empty object
            var objArr = [myObj]; // inserts it to an array
            myJSON = JSON.stringify(objArr); // converts it to a json file
            localStorage.setItem("records" + i + "JSON", myJSON); //creates the json
        }
    }
}

// checks if the table is valid - by the rows, cols and blocks
function checkTable() {
    let a = false, b = false, c = false, d = false, e = false, f = false, g = false, h = false, i = false; // flags which represents the appearance of the digit
    for (let row = 0; row < 9; row++) { // runs over the rows
        for (let col = 0; col < 9; col++) { // runs over all the cells in the row
            switch (document.getElementById("cell" + row + "" + col).value) {
                case '1':
                    if (a) {
                        paintInput(row, col);
                        return false;
                    }
                    a = true;
                    break;
                case '2':
                    if (b) {
                        paintInput(row, col);
                        return false;
                    }
                    b = true;
                    break;
                case '3':
                    if (c) {
                        paintInput(row, col);
                        return false;
                    }
                    c = true;
                    break;
                case '4':
                    if (d) {
                        paintInput(row, col);
                        return false;
                    }
                    d = true;
                    break;
                case '5':
                    if (e) {
                        paintInput(row, col);
                        return false;
                    }
                    e = true;
                    break;
                case '6':
                    if (f) {
                        paintInput(row, col);
                        return false;
                    }
                    f = true;
                    break;
                case '7':
                    if (g) {
                        paintInput(row, col);
                        return false;
                    }
                    g = true;
                    break;
                case '8':
                    if (h) {
                        paintInput(row, col);
                        return false;
                    }
                    h = true;
                    break;
                case '9':
                    if (i) {
                        paintInput(row, col);
                        return false;
                    }
                    i = true;
                    break;
                default:
                    paintInput(row, col);
                    if (document.getElementById("cell" + row + "" + col).value == '')
                        alert("All cells must be filled!")
                    return false;
            }
        }
        if (!a || !b || !c || !d || !e || !f || !g || !h || !i) // if not all the digits appear
            return false;
        a = false, b = false, c = false, d = false, e = false, f = false, g = false, h = false, i = false; // set all the flags to start over a new iteration 
    }

    for (let i = 0; i < N; i = i + SRN) { //check the blocks
        for (let j = 0; j < N; j = j + SRN)
            if (!checkBox(i, j)) // checks the given block
                return false;
    }
    return true;
}

//Checks if a block is valid
function checkBox(row, col) {
    let a = false, b = false, c = false, d = false, e = false, f = false, g = false, h = false, k = false; // flags which represents the appearance of the digit
    for (let i = 0; i < SRN; i++) { // runs over the rows
        for (let j = 0; j < SRN; j++) { // runs over all the cells in the row
            switch (document.getElementById("cell" + (row + i) + "" + (col + j)).value) {
                case '1':
                    if (a) {
                        paintInput(row + i, col + j);
                        return false;
                    }
                    a = true;
                    break;
                case '2':
                    if (b) {
                        paintInput(row + i, col + j);
                        return false;
                    }
                    b = true;
                    break;
                case '3':
                    if (c) {
                        paintInput(row + i, col + j);
                        return false;
                    }
                    c = true;
                    break;
                case '4':
                    if (d) {
                        paintInput(row + i, col + j);
                        return false;
                    }
                    d = true;
                    break;
                case '5':
                    if (e) {
                        paintInput(row + i, col + j);
                        return false;
                    }
                    e = true;
                    break;
                case '6':
                    if (f) {
                        paintInput(row + i, col + j);
                        return false;
                    }
                    f = true;
                    break;
                case '7':
                    if (g) {
                        paintInput(row + i, col + j);
                        return false;
                    }
                    g = true;
                    break;
                case '8':
                    if (h) {
                        paintInput(row + i, col + j);
                        return false;
                    }
                    h = true;
                    break;
                case '9':
                    if (k) {
                        paintInput(row + i, col + j);
                        return false;
                    }
                    k = true;
                    break;
            }
        }
    }
    if (!a || !b || !c || !d || !e || !f || !g || !h || !k) // if not all the digits appear
        return false;
    return true;
}

//paint the cell as wrong
function paintInput(row, col) {
    document.getElementById("cell" + row + "" + col).style.backgroundColor = 'rgba(224, 134, 22, 0.7)';
}

////---- TIMER SCRIPT ////
var flag = true; // represents the continuity of the timer
var minutesLabel = document.getElementById("minutes"); // connects the elements with variables
var secondsLabel = document.getElementById("seconds");
var hoursLabel = document.getElementById("hours");
var totalSeconds = 0; // counts the seconds
var totalHours = 0; // counts the hours

//updates the timer
function setTime() {
    if (levelGame == 4) {
        if (flag) {
            --totalSeconds;
            secondsLabel.innerHTML = pad(totalSeconds % 60);
            minutesLabel.innerHTML = pad(parseInt(getMinutes()));
            hoursLabel.innerHTML = pad(totalHours);
            if (totalSeconds == 0)
                endGame();
        }
    }
    else {
        if (flag) {
            ++totalSeconds;
            secondsLabel.innerHTML = pad(totalSeconds % 60);
            minutesLabel.innerHTML = pad(parseInt(getMinutes()));
            hoursLabel.innerHTML = pad(totalHours);
        }
    }
}

//pads the numbers to be with 2 digits
function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

//returns numner of minutes
function getMinutes() {
    if (totalSeconds > 3599) {
        totalSeconds -= 3600;
        totalHours++;
    }
    return (totalSeconds / 60);
}

//Starts the current game again
function again() {
    fillTable();
    if (levelGame == 4)
        totalSeconds = 900;
    else
        totalSeconds = 0;
    totalHours = 0;
    flag = true;
}

//Hides all the divs
function hide() {
    document.getElementById("about").style.display = "none";
    document.getElementById("instructions").style.display = "none";
    if (levelGame == null) { //if the level hasn't choosen yet
        document.getElementById("level").style.display = "block";
        document.getElementById("difficulty").style.display = "block";
    }
    else { // if we have started the game
        if (!gameOver) { // if the game continues
            document.getElementById("game").style.display = "block";
            document.getElementById("timer").style.display = "block";
        }
        else if (!flag) // in case we have finished the game
            document.getElementById("victory").style.display = "block";
    }
}

//Shows the about div and hide the others
function showAbout() {
    document.getElementById("about").style.display = "block";
    document.getElementById("game").style.display = "none";
    document.getElementById("level").style.display = "none";
    document.getElementById("difficulty").style.display = "none";
    document.getElementById("timer").style.display = "none";
    document.getElementById("instructions").style.display = "none";
    document.getElementById("victory").style.display = "none";
}

//Shows the instructions div and hide the others
function showInstructions() {
    document.getElementById("about").style.display = "none";
    document.getElementById("game").style.display = "none";
    document.getElementById("level").style.display = "none";
    document.getElementById("difficulty").style.display = "none";
    document.getElementById("timer").style.display = "none";
    document.getElementById("instructions").style.display = "block";
    document.getElementById("victory").style.display = "none";
}

//changes the music according to the selection
function setSong() {
    switch (document.getElementById('songs').value) {
        case 'Jazz':
            audio.pause();
            audio = new Audio('Jazz.mp3');
            audio.play();
            break;
        case 'Tropical House':
            audio.pause();
            audio = new Audio('Tropical.mp3');
            audio.play();
            break;
        case 'Eyal Golan':
            audio.pause();
            audio = new Audio('Eyal.mp3');
            audio.play();
            break;
        case 'Israeli':
            audio.pause();
            audio = new Audio('Israeli.mp3');
            audio.play();
            break;
        case 'None':
            audio.pause();
    }
}