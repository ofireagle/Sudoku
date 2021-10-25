//fill the records in the tables
function fillRecords() {
    for (let i = 1; i < 4; i++) { // runs over the 3 jsons
        let json = "records" + i + "JSON";
        let text = localStorage.getItem(json);
        var obj = JSON.parse(text);
        for (let j = 0; j < obj.length; j++) {
            document.getElementById("td" + i + "" + j + "a").innerHTML = obj[j].date;
            document.getElementById("td" + i + "" + j + "b").innerHTML = convertToTime(obj[j].time);
        }
    }
}

//Converts the number to time
function convertToTime(num) {
    time = String(num);
    if (time.length % 2 == 1)
        time = "0" + time;
    for (let i = time.length - 2; i >= 0; i = i - 2) {
        if (i != 0)
            time = time.slice(0, i) + ":" + time.slice(i);
    }
    return time;
}

//Shows the about div and hide the others
function showAbout() {
    document.getElementById("about").style.display = "block";
    document.getElementById("tableC").style.display = "none";
    document.getElementById("instructions").style.display = "none";
}

//Shows the instructions div and hide the others
function showInstructions() {
    document.getElementById("about").style.display = "none";
    document.getElementById("tableC").style.display = "none";
    document.getElementById("instructions").style.display = "block";
}

//Hides all the divs
function hide() {
    document.getElementById("about").style.display = "none";
    document.getElementById("instructions").style.display = "none";
    document.getElementById("tableC").style.display = "block";
}