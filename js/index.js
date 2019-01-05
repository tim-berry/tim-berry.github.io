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

// METAR tables
var oldqnh = new Object;

var airportdata = {
  "EGLL": {
    "rwyhdg": "270",
    "rwy1": "27",
    "rwy2": "9",
    "ta": "6000"
  },
  "EGKK": {
    "rwyhdg": "260",
    "rwy1": "26",
    "rwy2": "8",
    "ta": "6000"
  },
  "EGLC": {
    "rwyhdg": "270",
    "rwy1": "27",
    "rwy2": "9",
    "ta": "6000"
  },
  "EGSS": {
    "rwyhdg": "220",
    "rwy1": "22",
    "rwy2": "4",
    "ta": "6000"
  },
  "EGGW": {
    "rwyhdg": "260",
    "rwy1": "26",
    "rwy2": "8",
    "ta": "6000"
  },
  "EGCC": {
    "rwyhdg": "230",
    "rwy1": "23",
    "rwy2": "5",
    "ta": "5000"
  },
  "EGGP": {
    "rwyhdg": "270",
    "rwy1": "27",
    "rwy2": "9",
    "ta": "5000"
  },
  "EGNM": {
    "rwyhdg": "320",
    "rwy1": "32",
    "rwy2": "14",
    "ta": "5000"
  },
  "EGBB": {
    "rwyhdg": "330",
    "rwy1": "33",
    "rwy2": "15",
    "ta": "6000"
  },
  "EGNX": {
    "rwyhdg": "270",
    "rwy1": "27",
    "rwy2": "9",
    "ta": "6000"
  },
  "EGFF": {
    "rwyhdg": "300",
    "rwy1": "30",
    "rwy2": "12",
    "ta": "6000"
  },
  "EGGD": {
    "rwyhdg": "270",
    "rwy1": "27",
    "rwy2": "9",
    "ta": "6000"
  },
  "EGHH": {
    "rwyhdg": "260",
    "rwy1": "26",
    "rwy2": "8",
    "ta": "6000"
  },
  "EGHI": {
    "rwyhdg": "200",
    "rwy1": "20",
    "rwy2": "2",
    "ta": "6000"
  },
  "EGMC": {
    "rwyhdg": "230",
    "rwy1": "23",
    "rwy2": "5",
    "ta": "6000"
  },
  "EGHQ": {
    "rwyhdg": "300",
    "rwy1": "30",
    "rwy2": "12",
    "ta": "3000"
  },
  "EGKB": {
    "rwyhdg": "210",
    "rwy1": "21",
    "rwy2": "3",
    "ta": "6000"
  },
  "EGTE": {
    "rwyhdg": "260",
    "rwy1": "26",
    "rwy2": "8",
    "ta": "3000"
  },
};

table = new Tabulator("#weather", {
  index: "icao",
  resizableColumns: false,
  responsiveLayout:"hide",
  layout: "fitColumns",
  columns: [{
      title: "ICAO",
      field: "icao",
      headerSort: false,
      minWidth:50,
      responsive:0
    },
    {
      title: "Runway",
      field: "wind.degrees",
      headerSort: false,
      minWidth:50,
      responsive:0,
      formatter: function(cell, formatterParams, onRendered) {
        var icao = cell.getRow().getData().icao;
        var winddir = cell.getValue();
        var windspd = cell.getRow().getData().wind.speed_kts;
        var rwydir = airportdata[icao].rwyhdg;

        var tailwindcomp = (windspd * Math.cos((winddir-rwydir) * Math.PI / 180));

        if (tailwindcomp >= -5) {
          return pad(airportdata[icao].rwy1, 2)
        } else {
          return pad(airportdata[icao].rwy2, 2)
        }
      }
    },
    {
      title: "QNH",
      field: "barometer.mb",
      headerSort: false,
      minWidth:50,
      responsive:0,
      formatter: function(cell, formatterParams, onRendered) {
        var icao = cell.getRow().getData().icao;

        if (typeof oldqnh[icao] === "undefined") {
          oldqnh[icao] = Math.round(cell.getValue());
        };

        if (oldqnh[icao] == Math.round(cell.getValue())) {
          return Math.round(cell.getValue());
        } else {
          $(function() {
            $.amaran({
              'message': cell.getRow().getData().icao + ' QNH ' + Math.round(cell.getValue()),
              'position': 'bottom right',
              'sticky': true
            });
          });
          oldqnh[icao] = Math.round(cell.getValue());
          return Math.round(cell.getValue());
        }

      }
    },
    {
      title: "Wind",
      field: "wind.degrees",
      headerSort: false,
      minWidth:100,
      responsive:0,
      formatter: function(cell, formatterParams, onRendered) {
        if  (typeof cell.getValue() === "null"){
          return "000&deg; / 00 kts";
        } else {
          var wind = pad(cell.getValue(), 3);
          return wind + "&deg; / " + cell.getRow().getData().wind.speed_kts + " kts";
        }
      }
    },
    {
      title: "Visibilty",
      field: "visibility.meters",
      headerSort: false,
      responsive:2,
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
      headerSort: false,
      responsive:2,
    }

  ]
});

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
      table.setData(result.data);
    },
    error: function(error) {
      console.log(error);
    }
  });
}

// callsign search
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

// icao location search
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

// pad numbers (used for surface wind)
function pad(str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}
