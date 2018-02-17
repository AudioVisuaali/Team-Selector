// Creating socket
var sock = new WebSocket("ws://137.74.151.123:5001");
var users_list = [];
sock.onopen = function(event) {
  console.log("Connection succesful!");
};

// On message
sock.onmessage = function(event) {

  // Message logging
  var message = event.data;

  // New user added to the list
  if(message.startsWith("NU")) {
    var all_users = JSON.parse(message.substring(2));
    users_list = all_users;
    writeToUserList(all_users);
  }

  // On join
  if(message.startsWith("OJ")) {
    var all_users = JSON.parse(message.substring(2));
    writeToUserList(all_users[0]);
    wrtiteToTeamsList(all_users[1]);
  }

  // On reRoll
  if(message.startsWith("NT")) {
    var all_teams = JSON.parse(message.substring(2));
    wrtiteToTeamsList(all_teams);
  }

  // New team size
  if(message.startsWith("TS")) {
    update_team_size(JSON.parse(message.substring(2)));
  }
}

// update team size
function update_team_size(size) {
  var team_text = "Teams: " + size;
  document.getElementById('teamSize').innerHTML = team_text;
}

// Remove user
function removeuser(removeuser) {
  sock.send("RU" + removeuser);
}

// Team Size
function teamSize(size) {
  sock.send("TS" + size);
}

// Checks users input
function checkInput(input) {

  // if already in the list
  for (i = 0; i < users_list.length; i++) {
    if(users_list[i].toLowerCase() == input.toLowerCase()) {
      return
    }
  }

  // If empty
  if(input.trim() !== ""){
    sock.send("NU" + input);
    reset_text();
  }
}

// add user
document.getElementById('addUserButton').onclick = function() {
  var text = document.getElementById('fname').value;
  checkInput(text)
}

// Reset input fields text
function reset_text(){
  document.getElementById('fname').value = '';
}

// Re roll
document.getElementById('reRoll').onclick = function() {
  sock.send("RR");
}

// Toggle dropdown menu
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// pressing enter instead of submit new name
document.getElementById("fname")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("addUserButton").click();
    }
});

// Close the dropdown if the user clicks outside of it
window.onclick = function(e) {
  if (!e.target.matches('.dropbtn')) {
    var myDropdown = document.getElementById("myDropdown");
      if (myDropdown.classList.contains('show')) {
        myDropdown.classList.remove('show');
      }
  }
}

// Write to users list
function writeToUserList(list) {

  users_list = list.sort();

  // Creating list
  list.sort();
  var output = "";
  for (i = 0; i < list.length; i++) {
    output += "<h2 style='cursor: pointer' id='" + list[i] + "' onclick='removeuser(" + '"' + list[i] + '"' +")'>" + list[i] + "</h2>";
  }

  // Writing to html
  document.getElementById('users_list').innerHTML = output;
}

// Write to teams list
function wrtiteToTeamsList(all_teams) {
  var send_this = "";

  //  for each team
  for (i = 0; i < all_teams.length; i++) {

    // the array is defined and has at least one element
    if (typeof all_teams[i] !== 'undefined' && all_teams[i].length > 0) {
      var addthis = "";

      // For each team member in team
      for (j = 0; j < all_teams[i].length; j++) {
        addthis += "<h2>"+all_teams[i][j]+"</h2>";
      }
      send_this += "<h1>Team " + (i+1) + "</h1>" + addthis;
    }

  // Update teams list
  document.getElementById('teams_list').innerHTML = send_this;
  }
}
