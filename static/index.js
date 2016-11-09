//////////////////////////////////////////////////////////////////////////////
// Main Javascript file for the system.
// Author: Sarah Heimlich
//////////////////////////////////////////////////////////////////////////////
// Important Notes:
//
// Trigger-action pairs have the following architecture:
//      triggerPort comare triggerValue actionPort action
// Where if triggerPort compared (equal, greater than, or less than) to 
// triggerValue is true, then the action is executed on the actionPort.
//////////////////////////////////////////////////////////////////////////////


// Keep track of the number of trigger/action pairs.
// This number is used to assign each pair a unique ID number.
var triggers = 0;

// Helper function.  This creates the HTML for each trigger/action pair
// using the correct trigger/action pair ID and the currect sensor type.
// Each component of the trigger action pair is givent the class of the
// attribute's name and the ID of the attribute name plus the id number.
// For example, the triggerPort of pair zero would have the class
// "triggerPort" and the ID "triggerPort0".
function getTriggerHTML(port) {
  var portType = document.getElementById("setup" + port).value;
  
  // Div to hold the pair.
  var str = '<div class="pair" id=' + triggers + '>'

  // Create the triggerPort selection menu.
  str = str + "\n" + '<select class = "triggerPort" id="triggerPort' + triggers + '">';
  str = str + "\n" + '<option value="in' + port
  str = str + '">Port ' + port + '</option>';
  str = str + "\n" + '</select>';

  // The port is a touch sensor, the compart options are different to every
  // other sensor.
  if(portType == "TOUCH") {
    // Create the compare selection menu for a touch sensor.
    str = str + "\n" + '<select class="compare" id="compare' + triggers + '">';
    str = str + "\n" + '<option value="equal">is</option>';
    str = str + "\n" + '</select>';

    // Create the triggerValue selection menu for a touch sensor.
    str = str + "\n" + '<select class="triggerValue" id="triggerValue' + triggers + '">';
    str = str + "\n" + '<option value ="1">Touched</option>';
    str = str + "\n" + '<option value="0">Released</option>';
    str = str + "\n" + '</select>';
  }
  // The sensor is not a touch sensor.
  else {
    // Create the compare selection menu for a non-touch sensor.
    str = str + "\n" + '<select class="compare" id="compare' + triggers + '">';
    str = str + "\n" + '<option value ="greater">Greater than</option>';
    str = str + "\n" + '<option value="less">Less than</option>';
    str = str + "\n" + '<option value="equal">Equal to</option>';
    str = str + "\n" + '</select>';

    // Create the triggerValue selection area for a non-touch sensor.
    str = str + "\n" + '<textarea class="triggerValue" rows="1" cols="10"'
    str = str + 'id="triggerValue' + triggers + '">';
    str = str + "\n" + '</textarea>';
  }

  // Create the actionPort selection menu.
  str = str + "\n" + '<select class = "actionPort" id="actionPort' + triggers + '">';
  str = str + "\n" + '<option value="outA">Port A</option>';
  str = str + "\n" + '<option value="outB">Port B</option>';
  str = str + "\n" + '<option value="outC">Port C</option>';
  str = str + "\n" + '<option value="outD">Port D</option>';
  str = str + "\n" + '</select>';

  // Create the action selection menu.
  str = str + "\n" + '<select class="action" id="action' + triggers + '">';
  str = str + "\n" + '<option value="forward">Forward</option>';
  str = str + "\n" + '<option value="backward">Backward</option>';
  str = str + "\n" + '<option value="stop">Stop</option>';
  str = str + "\n" + '</select>';

  // Create the button to allow the trigger/action pair to be removed.
  str = str + "\n" + '<button onclick="removeTrigger(' + triggers+ ')">';
  str = str + 'Remove Trigger</button>';

  // Close the div the trigger/action pair is enclosed within
  str = str + "\n" + '</div>';

  // Return the string created within here.
  return str;
}

// Add a trigger/action Pair to the HTML DOM
function addTrigger(port) {
  document.getElementById("main").innerHTML = document.getElementById("main").innerHTML + getTriggerHTML(port);
  triggers++;
}

// Remove the trigger with the given triggerID from the HTML DOM.
// This removal includes the "pair" div the trigger/action pair
// was placed within.
function removeTrigger(trigger) {
  document.getElementById(trigger).remove();
}


// run(toSend) is the main function.
// toSend is the Javascript object that should be passed to the EV3.
// run is a recursive function.  Once an HTTP request is received, run is 
// executed again.
function run(toSend) {

  // If this is the first execution of run, toSend will be null, therefore
  // set it it to a null object.
  if(toSend == null) {
    var toSend = {};
  }

  // Create the HTTP request.
  var x = new XMLHttpRequest();

  // Set the function to call once the HTTP request has been received
  // and executed.
  x.onreadystatechange = function() {
    // If the reply has been sent.
    if(this.readyState == 4 && this.status == 200) {
      // Log the response text for debugging.
      console.log(x.responseText);
      // Parse the text into a JSON object.
      var j = JSON.parse(x.responseText);
      // Get all the trigger/action pairs.
      var pairs = document.getElementsByClassName("pair")

      // Go through the pairs in reverse order.  This ensures the priority
      // is set properly.
      for (i = pairs.length - 1; i >= 0; i--) {
        // Get the attributes of the trigger/action pair.
        var id = pairs[i].id;
        var triggerPort = document.getElementById("triggerPort" + id).value;
        var triggerValue = parseInt(document.getElementById("triggerValue" + id).value);
        var compare =document.getElementById("compare" + id).value;
        var actionPort = document.getElementById("actionPort" + id).value;
        var action = document.getElementById("action" + id).value;

        // Based on the comparison and trigger settings, add the setting
        // to the JSON object.
        // Note: this means trigger/action pairs processed later "overwrite" 
        // earlier.  This is how the priority is set.
        if(compare == "greater") {
          if(j[triggerPort] > triggerValue) {
            toSend[actionPort] = action;
          }
        }
        else if(compare == "less") {
          if(j[triggerPort] < triggerValue) {
            toSend[actionPort] = action;
          }
        }
        else if (compare == "equal") {
          if(j[triggerPort] == triggerValue) {
            toSend[actionPort] = action;
          }
        }
      }

      // Recursively call run with the updated JSON object.
      run(toSend);
    }
  };
  
  // Open the HTTP request.
  x.open("POST", "\\", true);
  // Log the request being sent for debugging.
  console.log("toSend = "+ JSON.stringify(toSend));
  // Send the JSON object determined by the last iteration of run
  // to the EV3 as a string.
  x.send(JSON.stringify(toSend));       
}


// Once the window is loaded, determine what sensors are in each port.
// Update the setup section of the program appropriately.
window.onload = function() {
  // Create the HTTP request.
  var x = new XMLHttpRequest();

  // Set the function to call once the HTTP request has been received
  // and executed.
  x.onreadystatechange = function() {
    // Once the reply is sent
    if(this.readyState == 4 && this.status == 200) {
      // Get the JSON of the response.
      var j = JSON.parse(x.responseText);
      // Update the setup menus appropriately.
      updateSetup(j.in1, 1);
      updateSetup(j.in2, 2);
      updateSetup(j.in3, 3);
      updateSetup(j.in4, 4);
    }
  }

  // Open the HTTP Request.
  x.open("POST", "\\", true);
  // Send the request.
  x.send("setup");
}

// Helper function.
// Change the setup menus as needed based on the modes available for the
// sensor plugged into the given port.
function updateSetup(modes, input) {
  // Get the HTML element where the new values should go.
  var element = document.getElementById("setup" + input);
  // Clear the previous values in the element.
  element.innerHTML = "";
  // Add all the modes to the selection menu.
  for(var i = 0; i < modes.length; i++) {
    element.innerHTML += "<option value='" + modes[i] + "'>" + modes[i] + "</option>";
  }
}
