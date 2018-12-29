// UTC Clock
function startTime() {
  offset = 0;
  var today = new Date();
  var h = today.getUTCHours();
  var m = today.getUTCMinutes();
  var s = today.getUTCSeconds();
  h = h + offset;
  if (h > 24) {
    h = h - 24;
  }
  if (h < 0) {
    h = h + 24;
  }
  h = checkTime(h);
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('clock').innerHTML = h + ":" + m + ":" + s;
  var t = setTimeout(function() {
    startTime()
  }, 500);
}

function checkTime(i) {
  if (i < 10) {
    i = "0" + i
  };
  return i;
}

startTime()

// List.js
var options = {
  valueNames: ['airport', 'start']
};

var starList = new List('star_table', options);

// Tabs
$(document).ready(function() {
  $('.tabs').tabs();
});

// METAR
//create Tabulator on DOM element with id "example-table"
table = new Tabulator("#weather", {
  index: "icao",
  resizableColumns: false,
  layout: "fitColumns",
  columns: [
    //Define Table Columns
    {
      title: "ICAO",
      field: "icao",
      headerSort: false
    },
    {
      title: "QNH",
      field: "barometer.mb",
      headerSort: false,
      formatter: function(cell, formatterParams, onRendered) {
          return Math.round(cell.getValue());
      }
    },
    {
      title: "Wind",
      field: "wind.degrees",
      headerSort: false,
      formatter: function(cell, formatterParams, onRendered) {
          var wind = pad(cell.getValue(),3);
          return wind + "&deg; / " + cell.getRow().getData().wind.speed_kts + " kts";
      }
    },
    {
      title: "Visibilty",
      field: "visibility.meters",
      headerSort: false,
      formatter: function(cell, formatterParams, onRendered) {
        if (cell.getValue().includes("+")) {
          return cell.getValue();
        } else {
          return Math.round(cell.getValue().replace(/,/g, "") / 100) * 100;
        }
      }
    },
    {
      title: "Ceiling",
      field: "ceiling.feet_agl",
      headerSort: false
    }

  ]
});

//define some sample data
ajaxCallUpdate();
setInterval(ajaxCallUpdate, 300000); //300000 MS == 5 minutes

function ajaxCallUpdate() {
  var tabledata = $.ajax({
    type: "GET",
    url: "https://api.checkwx.com/metar/egll,egkk,eglc,egss,eggw,egcc,eggp,egnm,egbb,egnx,egff,eggd,eghh,eghh,eghi,egmc,eghq,egkb,egte/decoded/",
    headers: {
      "X-API-Key": "f5616e0b457548cf07ac51b19a"
    },
    dataType: "json",
    success: function(result) {
      table.replaceData(result.data);
    },
    error: function(error) {
      console.log(error);
    }
  });
}

// callsign
function loadCallsign() {
  var airline = document.getElementById("icao").value;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      var response = JSON.parse(xhttp.responseText);
      if (!response[0]) {
        document.getElementById("result").innerHTML = '<p>No callsign found for ICAO code ' + airline.toUpperCase() + '</p>';
        return;
      }
      document.getElementById("result").innerHTML =
        '<p>ICAO Code: ' + response[0].operatorCode + '</p>' +
        '<p>Callsign: <strong>' + response[0].telephonyName + '</strong></p>' +
        '<p>Airline: ' + response[0].operatorName + '</p>' +
        '<p>Country: ' + response[0].countryName + '</p>';
    }
  }
  /* https://www.icao.int/safety/iStars/Pages/API-Data-Service.aspx */
  xhttp.open("GET", "https://v4p4sz5ijk.execute-api.us-east-1.amazonaws.com/anbdata/airlines/designators/code-list?api_key=e1056fc0-06e8-11e9-90b4-7b91eb5aa78d&format=json&states=&operators=" + airline, true);
  xhttp.send();
};

// location
function loadLocation() {
  var airport = document.getElementById("icao").value;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      var response = JSON.parse(xhttp.responseText);
      if (!response[0]) {
        document.getElementById("result").innerHTML = '<p>No location found for ICAO code ' + airport.toUpperCase() + '</p>';
        return;
      }
      document.getElementById("result").innerHTML =
        '<p>Location: ' + response[0].airportCode + '</p>' +
        '<p>Airport: <strong>' + response[0].airportName + '</strong></p>' +
        '<p>City: ' + response[0].cityName + '</p>' +
        '<p>Country: ' + response[0].countryName + '</p>';
    }
  }
  /* https://www.icao.int/safety/iStars/Pages/API-Data-Service.aspx */
  xhttp.open("GET", "https://v4p4sz5ijk.execute-api.us-east-1.amazonaws.com/anbdata/airports/locations/indicators-list?api_key=e1056fc0-06e8-11e9-90b4-7b91eb5aa78d&state=&format=json&airports=" + airport, true);
  xhttp.send();
};

function pad (str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}
