var server = require('ws').Server;
var s = new server({ port: 5001});

// Variables
var users = ["Joksu", "AV", "Topi", "Toni"];
var teams = [['AV', 'Topi'], ['Toni', 'Joksu'], [], [], [], [] ]
var teams_amount = 2;
var current_team = 0;

// Socket
s.on('connection', function(ws){

  var info = [[], [], 2]
  info[0] = users;
  info[1] = teams;
  info[2] = teams_amount;
  var sendd = "OJ" + JSON.stringify(info);
  ws.send(sendd);

  // On message
  ws.on('message', function(message) {

    // RE ROLL
    if(message.startsWith("RR")) {
      shuffle(users);
      teams = [[], [], [], [], [], []];
      current_team = 0;
      for (i = 0; i < users.length; i++) {
        if(current_team == teams_amount) {
          current_team = 0;
        }
        teams[current_team].push(users[i]);
        current_team += 1;
      }
      teams_list_send_all(teams)
    }

    // NEW USER
    if(message.startsWith("NU")) {
      var letter = message.substring(2);



      if(checkInput(letter)) {
        users.push(letter);
        users_list_send_all(users);
        //ws.send("NU" + input);
      }
    }

    // REMOVE USER
    if(message.startsWith("RU")) {
      var clean = message.substring(2)
      for (i = 0; i < users.length; i++) {
        if(users[i] == clean) {
          users.splice([i], 1);
        }
      users_list_send_all(users);
    }}

    // team size change
    if(message.startsWith("TS")) {
      teams_amount = message.substring(2)
      team_size_update(teams_amount)
    }
  })
});

// Update users list
function users_list_send_all(users) {
  var sendd = "NU" + JSON.stringify(users)
  s.clients.forEach(function e(client) {
    client.send(sendd);
  });
}

// Update teams list
function teams_list_send_all(teams) {
  var sendd = "NT" + JSON.stringify(teams)
  s.clients.forEach(function e(client) {
    client.send(sendd);
  });
}

//Update teamsize
function team_size_update(size) {
  s.clients.forEach(function e(client) {
    client.send("TS" + size);
  });
}

// Shuffle
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle
  while (0 !== currentIndex) {

    // Pick a remaining element
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Checks users input
function checkInput(input) {

  // if already in the list
  for (i = 0; i < users.length; i++) {
    if(users[i].toLowerCase() == input.toLowerCase()) {
      return false;
    }}

  // If empty
  if(input.trim() !== ""){
    return true;
  } else {
    return false;
  }
}
