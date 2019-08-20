var trainsDb = firebase.database().ref("trains/");
var trains = {};

// Iterate all trains and generate a table row for each one
function displayTrains() {
  var trainList = $("#trainList");
  trainList.empty();

  // Create column headers
  trainList.append(
    $("<tr>").append(
      $("<th>").text("Train Name"),
      $("<th>").text("Destination"),
      $("<th>").text("Frequency (min)"),
      $("<th>").text("Next Arrival"),
      $("<th>").text("Minutes Away")
    )
  );

  // Add rows for each train
  for (var train in trains) {
    let trainData = trains[train];
    let currentTime = moment();
    let frequency = parseInt(trainData.frequency);
    let firstDeparture = moment(trainData.firstDeparture, "HH:mm").subtract(1, "years");

    // Calculate mintues away
    let minsUntil = frequency - (currentTime.diff(firstDeparture, "minutes") % frequency);
    // Calculate next arrival
    let nextArrival = currentTime.add(minsUntil, "minutes").format("hh:mm a");

    // Creates row HTML and append it to the table
    trainList.append(
      $("<tr>").append(
        $("<td>").text(train),
        $("<td>").text(trainData.destination),
        $("<td>").text(trainData.frequency),
        $("<td>").text(nextArrival),
        $("<td>").text(minsUntil)
      )
    );
  }
}

// Updates trains and HTML table when database is updated
trainsDb.on("value", function (snapshot) {
  trains = snapshot.val();
  displayTrains();
});

// Add new train to database
$("#addTrain button").click(function () {
  var trainName = $("#name").val();
  trainsDb.child(trainName).set({
    destination: $("#destination").val(),
    firstDeparture: $("#firstDeparture").val(),
    frequency: $("#frequency").val()
  });
});

// Recalculates next arrival and minutes away every minute
setInterval(displayTrains, 60000)
