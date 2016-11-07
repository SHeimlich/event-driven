var triggers = 0;
function getTriggerHTML(port) {
  var portType = document.getElementById("setup" + port).value;
  
  var str = '<div class="boxy" id=' + triggers + '>'

  str = str + "\n" + '<select class = "port" id="port' + triggers + '">';
  str = str + "\n" + '<option value="in' + port
  str = str + '">Port ' + port + '</option>';
  str = str + "\n" + '</select>';

  if(portType != "touch") {
    str = str + "\n" + '<select class="compare" id="compare' + triggers + '">';
    str = str + "\n" + '<option value ="greater">Greater than</option>';
    str = str + "\n" + '<option value="less">Less than</option>';
    str = str + "\n" + '<option value="equal">Equal to</option>';
    str = str + "\n" + '</select>';


    str = str + "\n" + '<textarea class="in" rows="1" cols="10"'
    str = str + 'id="in' + triggers + '">';
    str = str + "\n" + '</textarea>';
    

  }
  else {
    str = str + "\n" + '<select class="compare" id="compare' + triggers + '">';
    str = str + "\n" + '<option value="equal">is</option>';
    str = str + "\n" + '</select>';

    str = str + "\n" + '<select class="in" id="in' + triggers + '">';
    str = str + "\n" + '<option value ="1">Touched</option>';
    str = str + "\n" + '<option value="0">Released</option>';
    str = str + "\n" + '</select>';
  }

  str = str + "\n" + '<select class = "out" id="out' + triggers + '">';
  str = str + "\n" + '<option value="outA">Port A</option>';
  str = str + "\n" + '<option value="outB">Port B</option>';
  str = str + "\n" + '<option value="outC">Port C</option>';
  str = str + "\n" + '<option value="outD">Port D</option>';
  str = str + "\n" + '</select>';

  str = str + "\n" + '<select class="direction" id="direction' + triggers + '">';
  str = str + "\n" + '<option value="forward">Forward</option>';
  str = str + "\n" + '<option value="backward">Backward</option>';
  str = str + "\n" + '<option value="stop">Stop</option>';
  str = str + "\n" + '</select>';

  str = str + "\n" + '<button onclick="removeTrigger(' + triggers+ ')">';
  str = str + 'Remove Trigger</button>';
  str = str + "\n" + '</div>';
  return str;
}

function addTrigger(port) {
  document.getElementById("main").innerHTML = document.getElementById("main").innerHTML + getTriggerHTML(port);
  triggers++;
}

function removeTrigger(trigger) {
  document.getElementById(trigger).remove();
}


function run(toSend) {

  if(toSend == null) {
    var toSend = {};
  }

  var x = new XMLHttpRequest();

  
  x.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      console.log(x.responseText);
      var j = JSON.parse(x.responseText);

      var ins = []
      var outs = []
      var directions = []
      var pairs = document.getElementsByClassName("boxy")

      for (i = 0; i < pairs.length; i++) {
        var id = pairs[i].id;
        console.log("id = " + id);
        var port = document.getElementById("port" + id).value;
        var value = parseInt(document.getElementById("in" + id).value);
        var compare =document.getElementById("compare" + id).value;
        var out = document.getElementById("out" + id).value;
        var direction = document.getElementById("direction" + id).value;

        if(compare == "greater") {
          if(j[port] > value) {
            toSend[out] = direction;
          }
        }
        else if(compare == "less") {
          if(j[port] < value) {
            toSend[out] = direction;
          }
        }
        else if (compare == "equal") {
          if(j[port] == value) {
            toSend[out] = direction;
          }
        }
      }

      run(toSend);
    }
  };
  
  x.open("POST", "\\", true);
  console.log("toSend = "+ JSON.stringify(toSend));
  x.send(JSON.stringify(toSend));       
}