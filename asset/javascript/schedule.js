// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve train info from the moment database.
// 4. Create a way to calculate the Frequency, Next Arival, Minutes Away.
// Using difference between start and current time.
// Then use moment.js formatting to set difference in time.


// Initialize Firebase
var config = {
  apiKey: "AIzaSyAyvYcDGnRQcQcna_4CJBMipyYFu2sZ9Z4",
  authDomain: "traintime-b27d4.firebaseapp.com",
  databaseURL: "https://traintime-b27d4.firebaseio.com",
  projectId: "traintime-b27d4",
  storageBucket: "",
  messagingSenderId: "401935247613"
};
firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Employees
$("#add-train-btn").on("click", function (event) {
  event.preventDefault();


  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTrainTime = moment($("#time-input").val().trim(), "MM/DD/YYYY").format("X");
  var frequency = $("#frequency-input").val().trim();
  
  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: destination,
    trainTime: firstTrainTime,
    frequency: frequency
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.trainTime);
  console.log(newTrain.frequency);

  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#time-input").val("");
  $("#frequency-input").val("");
});

var strRow=""; //to convert and hold the string.
// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var destination = childSnapshot.val().destination;
  var firstTrainTime = childSnapshot.val().trainTime;
  var frequency = childSnapshot.val().frequency;

  //loging train Info
  console.log(trainName);
  console.log(destination);
  console.log(firstTrainTime);
  console.log(frequency);

  // Calculate the Next Arival Time.
  // var ts = moment().diff(moment(firstTrainTime+frequency, "X"), "seconds");

  // var nextArival = moment(ts);

  // var minAway = moment.duration(nextArival, "minutes").humanize(); 




  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTrainTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
  console.log(firstTrainTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTrainTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % frequency;
  console.log(tRemainder);

  // Minute Until Train
  var minAway = (frequency - tRemainder);
  console.log("MINUTES TILL TRAIN: " + minAway);

  // Next Train
  var nextArival = moment().add(minAway, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextArival).format("hh:mm"));
 


  // Create the new row
  // var newRow = $("<tr>").append(
  //   $("<td>").text(trainName),
  //   $("<td>").text(destination),
  //   $("<td>").text(frequency),
  //   $("<td>").text(moment(nextArival).format("hh:mm")),
  //   // $("<td>").text(minAway)
  //   $("<td>").text(moment.duration(minAway, "minutes").humanize())
  // );

  // created a global str variable to do string concatenation
  strRow ="<tr><td>"+trainName+"</td><td>"+destination+"</td><td>"
  +frequency+"</td><td>"+moment(nextArival).format("hh:mm")+"</td> <td>"
  +moment.duration(minAway, "minutes").humanize()+"</td></tr>";

  console.log(strRow);
  // Append the new row to the table
  $("tbody").append(strRow);
});


