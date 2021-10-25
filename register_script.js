//Signs up the user
function signUp() {
  let nameInput = document.getElementById("userName").value;
  let passwordInput = document.getElementById("password").value;
  if(nameInput==""){
    document.getElementById('notification').innerHTML = "Must enter a username";
    return;
  }
  document.getElementById('notification').innerHTML = "";
  // Storing data:
  var myObj = { name: nameInput, password: passwordInput };
  text = localStorage.getItem("usersJSON");
  var objArr = JSON.parse(text);
  objArr.push(myObj);
  myJSON = JSON.stringify(objArr);
  localStorage.setItem("usersJSON", myJSON); // updates the json
  alert("Registration Complete!");
}

//Sign in the user
function signIn() {
  let nameInput = document.getElementById("userName").value;
  let passwordInput = document.getElementById("password").value;
  // Retrieving data:
  text = localStorage.getItem("usersJSON");
  var obj = JSON.parse(text);
  for (let i = 0; i < obj.length; i++) { // runs over all the registered users
    if (nameInput == obj[i].name && passwordInput == obj[i].password) { // checks if the details inserted are matching to a registered user
      document.getElementById('notification').innerHTML = "";
      window.location.href = "game.html"; // jumps into the game
      return;
    }
    else {
      document.getElementById('notification').innerHTML = "Incorrect username or password";
    }
  }
}

//Creates a json of users on load
function onceLoad() {
  text = localStorage.getItem("usersJSON");
  var objArr = JSON.parse(text);
 if (objArr == null) { // if there is no json then
    var myObj = { name: "abcd", password: "1234" }; // create an object
    var objArr = [myObj]; // enters the the object to an array
    myJSON = JSON.stringify(objArr); // converts the array to json
    localStorage.setItem("usersJSON", myJSON); // updates the json file
  }
}