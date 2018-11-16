// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve train info from the moment database.
// 4. Create a way to calculate the Frequency, Next Arival, Minutes Away.
// Using difference between start and current time.
// Then use moment.js formatting to set difference in time.


// Initialize Firebase
// var config = {
//   apiKey: "AIzaSyAyvYcDGnRQcQcna_4CJBMipyYFu2sZ9Z4",
//   authDomain: "traintime-b27d4.firebaseapp.com",
//   databaseURL: "https://traintime-b27d4.firebaseio.com",
//   projectId: "traintime-b27d4",
//   storageBucket: "",
//   messagingSenderId: "401935247613"
// };
// firebase.initializeApp(config);

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAyvYcDGnRQcQcna_4CJBMipyYFu2sZ9Z4",
    authDomain: "traintime-b27d4.firebaseapp.com",
    databaseURL: "https://traintime-b27d4.firebaseio.com",
    projectId: "traintime-b27d4",
    storageBucket: "traintime-b27d4.appspot.com",
    messagingSenderId: "401935247613"
  };
  firebase.initializeApp(config);

var database = firebase.database();
var trainName; 
var destination;
var firstTrainTime ;
var frequency;
// 2. Button for adding Employees
$("#add-train-btn").on("click", function (event) {
  event.preventDefault();

alert("clicked");
  // Grabs user input
   trainName = $("#train-name-input").val().trim();
    destination = $("#destination-input").val().trim();
   firstTrainTime = $("#time-input").val().trim(); 
    frequency = $("#frequency-input").val().trim();
  
  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: destination,
    trainTime: firstTrainTime,
    frequency: frequency
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

 

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
   trainName = childSnapshot.val().name;
    destination = childSnapshot.val().destination;
    firstTrainTime = childSnapshot.val().trainTime;
    frequency = childSnapshot.val().frequency;




  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTrainTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
  console.log(firstTrainTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTrainTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)  (frequency - remainder = minAway )
  var tRemainder = diffTime % frequency; 
  console.log(tRemainder);

  // Minute Until Train
  var minAway = (frequency - tRemainder);
  console.log("MINUTES TILL TRAIN: " + minAway);

  // Next Train
  var nextArival = moment().add(minAway, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextArival).format("hh:mm A"));
 


//    function meridiem (hours, minutes, isLower) {
//     if (nextArival > 11) {
//         return isLower ? 'pm' : 'PM';
//     } else {
//         return isLower ? 'am' : 'AM';
//     }
// }



  // Create the new row
  // var newRow = $("<tr>").append(
  //   $("<td>").text(trainName),
  //   $("<td>").text(destination),
  //   $("<td>").text(frequency),
  //   $("<td>").text(moment(nextArival).format("hh:mm")),
  //   $("<td>").text(minAway)
  //   // $("<td>").text(moment.duration(minAway, "minutes").humanize())
  // );

  // created a global str variable to do string concatenation
  strRow ="<tr><td>"+trainName+"</td><td>"+destination+"</td><td>"
  +frequency+"</td><td>"+moment(nextArival).format("hh:mm A")+"</td> <td>"
  +minAway +" minutes</td></tr>";

  console.log(strRow);
 $("tbody").append(strRow);
});


