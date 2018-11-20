var countryData; var project_wise_data; var tasks; var selectedCountryId = 0;

gantt.config.duration_unit = "quarter";//an hour
gantt.config.row_height = 20;
gantt.date.quarter_start = function (date) {
  gantt.date.month_start(date);
  var m = date.getMonth(),
    res_month;

  if (m >= 9) {
    res_month = 9;
  } else if (m >= 6) {
    res_month = 6;
  } else if (m >= 3) {
    res_month = 3;
  } else {
    res_month = 0;
  }

  date.setMonth(res_month);
  return date;
};
gantt.date.add_quarter = function (date, inc) {
  return gantt.date.add(date, inc * 3, "month");
};
function quarterLabel(date) {
  var month = date.getMonth();
  var q_num;

  if (month >= 9) {
    q_num = 4;
  } else if (month >= 6) {
    q_num = 3;
  } else if (month >= 3) {
    q_num = 2;
  } else {
    q_num = 1;
  }
  return "Q" + q_num;
}

gantt.config.subscales = [
  { unit: "quarter", step: 1, template: quarterLabel }
  // ,{unit:"month", step:1, date:"%M" }
];
gantt.config.scale_unit = "year";
gantt.config.step = 1;
/*  gantt.config.subscales = [
                           {unit:"quarter", step:1, date:"Quarter #%q"}
                       ]; */
gantt.config.date_scale = "%Y";

gantt.config.columns = [
  { name: "text", label: "Project Name", tree: true, width: 150 },
  { name: "start_date", label: "Start time", align: "center" },
  { name: "duration", label: "Duration", align: "center" }
];

gantt.attachEvent("onTaskClick", function (task_id, e) {
  var selectedTask = null, node = null;
  for (var i in tasks.data) {

    if (tasks.data[i].id == task_id) {
      //alert(tasks.data[i].node)
      node = tasks.data[i].node
      selectedTask = tasks.data[i];
    }
  }
  if (selectedTask.parent == 0) {
    return true;
  }
  var options = [];

  if (node == 'project') {
    options = $("select#project_consolidation_view option").
      map(function () { return parseInt($(this).val()); }).get();
    if (options.indexOf(selectedTask.project_id) == -1) {
      return true;
    }
    toggleView('project_consolidation_view', selectedTask.project_id);
  } else if (node == 'country') {
    options = $("select#country_consolidation_view option").
      map(function () { return parseInt($(this).val()); }).get();
    if (options.indexOf(selectedTask.country_id) == -1) {
      return true;
    }
    toggleView('country_consolidation_view', selectedTask.country_id);
  } else if (node == 'resource') {
    options = $("select#resource_consolidation_view option").
      map(function () { return parseInt($(this).val()); }).get();
    if (options.indexOf(selectedTask.resource_id) == -1) {
      return true;
    }
    toggleView('resource_consolidation_view', selectedTask.resource_id);
  }

  // if ($("#country_consolidation_view").is(":visible")) {
  //   options = $("select#project_consolidation_view option").
  //     map(function () { return parseInt($(this).val()); }).get();
  //   if (options.indexOf(selectedTask.project_id) == -1) {
  //     return true;
  //   }
  //   toggleView('project_consolidation_view', selectedTask.project_id);
  // } else {
  //   options = $("select#country_consolidation_view option").
  //     map(function () { return parseInt($(this).val()); }).get();
  //   if (options.indexOf(selectedTask.country_id) == -1) {
  //     return true;
  //   }
  //   toggleView('country_consolidation_view', selectedTask.country_id);
  // }

  return false;
});


gantt.templates.task_class = function (start, end, task) {
  if (task.parent == 0) {
    return "parent_task";
  }
  if (task.project_id == jdeProjectId) {
    return "jde_task";
  } else if (task.project_id == gssProjectId) {
    return "gss_task";
  }
};
function changeSelectedProject(selectionId) {
  selectedCountryId = 0; // reset
//  initCardLayout(); // prepare angular material cards
  tasks = { "data": [] };
  for (var i in project_consolidation_view.data) {
    var task = project_consolidation_view.data[i];
    if (selectionId == 0
      || (task.project_id == selectionId)
    ) {
      tasks.data.push(task);
    }
  }
  gantt.clearAll(); gantt.parse(tasks);
}

function changeSelectedCountry(selectionId) {
  selectedCountryId = selectionId;
  //initCardLayout(); // prepare angular material cards
  tasks = { "data": [] };
  for (var i in country_consolidation_view.data) {
    var task = country_consolidation_view.data[i];
    if (selectionId == 0
      || (task.country_id == selectionId)
    ) {
      tasks.data.push(task);
    }
  }
  gantt.clearAll(); gantt.parse(tasks);
  return tasks;
}
function changeSelectedResource(selectionId) {
  selectedCountryId = selectionId;
 // initCardLayout(); // prepare angular material cards
  tasks = { "data": [] };
  for (var i in resource_consolidation_view.data) {
    var task = resource_consolidation_view.data[i];
    if (selectionId == 0
      || (task.resource_id == selectionId)
    ) {
      tasks.data.push(task);
    }
  }
  gantt.clearAll(); gantt.parse(tasks);
  return tasks;
}
function changeColor(color) {
  for (var i in tasks.data) {
    if (tasks.data[i].project_id == jdeProjectId ||
      tasks.data[i].project_id == gssProjectId ||
      tasks.data[i].parent == 0) {
      continue;
    }
    console.log(tasks.data[i].parent + "-" + tasks.data[i].text);
    tasks.data[i].color = color;
  }
  gantt.clearAll(); gantt.parse(tasks);
}
function toggleView(viewType, selectionId) {
  //	$("#country_consolidation_view").toggle(); $("#project_consolidation_view").toggle();
  if (viewType == 'project_consolidation_view') {
    $("#country_consolidation_view").hide(); $("#project_consolidation_view").show(); $("#resource_consolidation_view").hide();
    $("#map_view").hide(); $("#gantt_selection_criteria").show();
    $("#gantt_view").show();
    $("#project_consolidation_view").val(selectionId);
    return changeSelectedProject(selectionId);
  } else if (viewType == 'country_consolidation_view') {
    $("#country_consolidation_view").show(); $("#project_consolidation_view").hide(); $("#resource_consolidation_view").hide();
    $("#map_view").hide(); $("#gantt_selection_criteria").show();
    $("#gantt_view").show();
    $("#country_consolidation_view").val(selectionId);
    return changeSelectedCountry(selectionId);
  } else if (viewType == 'resource_consolidation_view') {
    $("#resource_consolidation_view").show(); $("#project_consolidation_view").hide(); $("#country_consolidation_view").hide();
    $("#map_view").hide(); $("#gantt_selection_criteria").show();
    $("#gantt_view").show();
    $("#resource_consolidation_view").val(selectionId);
    return changeSelectedResource(selectionId);
  } else if (viewType == 'map_view') {
    $("#map_view").show(); $("#gantt_selection_criteria").hide();
    $("#country_consolidation_view").hide(); $("#project_consolidation_view").hide();
    $("#gantt_view").hide();

    google.maps.event.trigger(map, 'resize');
  }
}



// Timeline JS

var icon = $('.play');
icon.click(function () {
  icon.toggleClass('active');
  return false;
});
var currentState = "no-play";
var playTimeline;
function runTimeline() {
  if (currentState == "no-play") {
    currentState = "play";
    //setInterval(moveToNext(), 500);
    playTimeline = setInterval(function () {
      moveToNext();
    }, 1000);
  } else {
    currentState = "no-play";
    clearInterval(playTimeline);
  }
}
var $range = $(".js-range-slider");

var valueData = ["Q1-2018", "Q2-2018", "Q3-2018", "Q4-2018",
  "Q1-2019", "Q2-2019", "Q3-2019", "Q4-2019", "Q1-2020",
  "Q2-2020", "Q3-2020", "Q4-2020", "Q1-2021", "Q2-2021",
  "Q3-2021", "Q4-2021", "Q1-2022", "Q2-2022", "Q3-2022",
  "Q4-2022", "Q1-2023", "Q2-2023", "Q3-2023", "Q4-2023",
  "Q1-2024", "Q2-2024", "Q3-2024", "Q4-2024", "Q1-2025",
  "Q2-2025", "Q3-2025", "Q4-2025"];
$range.ionRangeSlider({
  values: valueData,
  type: "double",
  from: 0,
  to: 4,
  grid: true,
  onChange: function (data) {
    onSliderChange(data);
  }
});

var slider = $range.data("ionRangeSlider");
function moveToNext() {
  var value = $range.prop("value").split(";");
  var currentLastVal = value[1];
  var nextLastVal = valueData.indexOf(currentLastVal) + 1;
  slider.update({
    to: nextLastVal
  });
}

// Map JS

// If you're adding a number of markers, you may want to drop them on the map
// consecutively rather than all at once. This example shows how to use
// window.setTimeout() to space your markers' animation.

var neighborhoods = [
  { lat: 57.51582287, lng: -101.55761719 },
  { lat: 46.818188, lng: 8.227512 },
  { lat: 39.399872, lng: -8.224454 },
  { lat: 22.3524918, lng: 113.8468122 }, { lat: 46.3440362, lng: -5.437133 },
  { lat: 45.8849918, lng: -6.9542167 }, { lat: 39.8742163, lng: -12.7342511 },
  { lat: 51.0963397, lng: 5.9554144 }, { lat: 40.9544374, lng: 3.6936241 },
  { lat: 31.7078272, lng: 120.2219073 }, { lat: 37.9305884, lng: 123.1621725 },

];

var markers = []; var map;
var infowindow; var contentString = "";

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 2
    , center: { lat: 54.095259525449464, lng: 13.410 }
  });
  infowindow = new google.maps.InfoWindow({
    content: contentString
  });

  addMarkerWithTimeout(neighborhoods);
}

function drop() {
  clearMarkers();
  for (var i = 0; i < neighborhoods.length; i++) {

  }
  addMarkerWithTimeout(neighborhoods);
}

function addMarkerWithTimeout(neighborhoods) {
  for (var i = 0; i < neighborhoods.length; i++) {
    (function (marker) {
      var marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        map: map,
        position: neighborhoods[i]
      });

      /*  google.maps.event.addDomListener(marker, 'click', function() {
          renderProjectContent(marker.position.lat(),marker.position.lng(),this);
       }); */
    })(markers[i]);
  }
  //$("#map_view").hide();
}
function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

var xhttp = new XMLHttpRequest();
xhttp.onload = function () {
  if (this.readyState == 4 && this.status == 200) {
    // Typical action to be performed when the document is ready:
    var response = xhttp.responseText;

    csvData = JSON.parse(response)

  }
};
xhttp.open("GET", "http://localhost:48157/api/format/GetAllCSVData", false);
xhttp.send();

// Query.
query = (csvData, filters) => {

  // filters = [{key: 'category', value: 'string'}..]

  return csvData.filter((e) => {

    // Found?
    return filters.reduce((found, filter) => {
      if (!(e[filter.key].includes(filter.value))) return false
      return found
    }, true)

  })

}


// Log.
project_consolidation_view = []
country_consolidation_view = []
resource_consolidation_view = []
projectidarray = [];
countryidarray = [];
resourceidarray = [];

projectid = 0, countryid = 0, resourceid = 0;

dupesproject = [];
dupescountry = [];
dupesresource = [];


jQuery.each(csvData, function (i, val) {
  if (!dupesproject[csvData[i].project_name]) {
    dupesproject[csvData[i].project_name] = true;
    {
      dupescountry = [];
      if (projectidarray[csvData[i].project_name] == undefined) {
        projectidarray[csvData[i].project_name] = projectid + 1
      }
      projectid = projectid + 1;
      //  projectidarray[csvData[i].project_name] = i + 1;
      projectfilterdata = query(csvData, [{ key: 'project_name', value: csvData[i].project_name }])
      project_consolidation_view.push(
        {
          node: 'project', id: projectidarray[csvData[i].project_name], project_id: projectidarray[csvData[i].project_name], text: projectfilterdata[0].project_name, start_date: projectfilterdata[0].start_date, end_date: projectfilterdata[0].end_date, open: true
        })

      jQuery.each(projectfilterdata, function (j, val) {
        if (!dupescountry[val["country_name"]]) {
          dupescountry[val["country_name"]] = true;
          {
            dupesresource = []
            countryfilterdata = query(csvData, [{ key: 'project_name', value: csvData[i].project_name }, { key: 'country_name', value: val["country_name"] }])

            if (countryidarray[val["country_name"]] == undefined) {
              countryidarray[val["country_name"]] = countryid + 1
            }
            countryid = countryid + 1;

            project_consolidation_view.push(
              {
                node: 'country', id: projectidarray[csvData[i].project_name].toString() + countryidarray[val["country_name"]].toString(), country_id: countryidarray[val["country_name"]], project_id: projectidarray[csvData[i].project_name].toString(), text: val["country_name"], start_date: val["start_date"], end_date: val["end_date"], isAlreadyLive: "false", parent: projectidarray[csvData[i].project_name], open: true
              })

            jQuery.each(countryfilterdata, function (k, val) {
              if (!dupesresource[val["resource_name"]]) {
                dupesresource[val["resource_name"]] = true;
                {

                  if (resourceidarray[val["resource_name"]] == undefined) {
                    resourceidarray[val["resource_name"]] = resourceid + 1
                  }
                  resourceid = resourceid + 1;
                  project_consolidation_view.push(
                    {
                      node: 'resource', id: projectidarray[csvData[i].project_name].toString() + countryidarray[val["country_name"]].toString() + resourceidarray[val["resource_name"]].toString(), country_id: countryidarray[val["country_name"]], project_id: projectidarray[csvData[i].project_name].toString(), resource_id: resourceidarray[val["resource_name"]], text: val["resource_name"], start_date: val["start_date"], end_date: val["end_date"], isAlreadyLive: "false", parent: projectidarray[csvData[i].project_name].toString() + countryidarray[val["country_name"]].toString()
                    })
                }
              }
            });
          }
        }
      });

    }
  }
});

console.log(projectidarray);
console.log(countryidarray);
console.log(resourceidarray);


dupesproject = [];
dupescountry = [];
dupesresource = [];

jQuery.each(csvData, function (i, val) {
  if (!dupescountry[csvData[i].country_name]) {
    dupescountry[csvData[i].country_name] = true;
    {
      dupesresource = [];
      //  projectidarray[csvData[i].project_name] = i + 1;
      countryfilterdata = query(csvData, [{ key: 'country_name', value: csvData[i].country_name }])
      country_consolidation_view.push(
        {
          node: 'country', id: countryidarray[csvData[i].country_name], country_id: countryidarray[csvData[i].country_name], text: countryfilterdata[0].country_name, start_date: countryfilterdata[0].start_date, end_date: countryfilterdata[0].end_date, isAlreadyLive: false, open: true
        })

      jQuery.each(countryfilterdata, function (j, val) {
        if (!dupesresource[val["resource_name"]]) {
          dupesresource[val["resource_name"]] = true;
          {
            dupesproject = [];
            resourcefilterdata = query(csvData, [{ key: 'country_name', value: csvData[i].country_name }, { key: 'resource_name', value: val["resource_name"] }])

            country_consolidation_view.push(
              {
                node: 'resource', id: countryidarray[csvData[i].country_name].toString() + resourceidarray[val["resource_name"]].toString(), country_id: countryidarray[csvData[i].country_name], resource_id: resourceidarray[val["resource_name"]], text: val["resource_name"], start_date: val["start_date"], end_date: val["end_date"], isAlreadyLive: "false", parent: countryidarray[csvData[i].country_name], open: true
              })

            jQuery.each(resourcefilterdata, function (k, val) {
              if (!dupesproject[val["project_name"]]) {
                dupesproject[val["project_name"]] = true;
                {
                  country_consolidation_view.push(
                    {
                      node: 'project', id: countryidarray[csvData[i].country_name].toString() + resourceidarray[val["resource_name"]].toString() + projectidarray[val["project_name"]].toString(), country_id: countryidarray[csvData[i].country_name].toString(), project_id: projectidarray[val["project_name"]], resource_id: resourceidarray[val["resource_name"]], text: val["project_name"], start_date: val["start_date"], end_date: val["end_date"], isAlreadyLive: "false", parent: countryidarray[csvData[i].country_name].toString() + resourceidarray[val["resource_name"]].toString()
                    })
                }
              }
            });
          }
        }
      });

    }
  }
});

dupesproject = [];
dupescountry = [];
dupesresource = [];


jQuery.each(csvData, function (i, val) {
  if (!dupesresource[csvData[i].resource_name]) {
    dupesresource[csvData[i].resource_name] = true;
    {
      dupesproject = [];

      resourcefilterdata = query(csvData, [{ key: 'resource_name', value: csvData[i].resource_name }])
      resource_consolidation_view.push(
        {
          node: 'resource', id: resourceidarray[csvData[i].resource_name], resource_id: resourceidarray[csvData[i].resource_name], text: resourcefilterdata[0].resource_name, start_date: resourcefilterdata[0].start_date, end_date: resourcefilterdata[0].end_date, open: true
        })

      jQuery.each(resourcefilterdata, function (j, val) {
        if (!dupesproject[val["project_name"]]) {
          dupesproject[val["project_name"]] = true;
          {
            dupescountry = []
            projectfilterdata = query(csvData, [{ key: 'resource_name', value: csvData[i].resource_name }, { key: 'project_name', value: val["project_name"] }])

            resource_consolidation_view.push(
              {
                node: 'project', id: resourceidarray[csvData[i].resource_name].toString() + projectidarray[val["project_name"]].toString(), project_id: projectidarray[val["project_name"]], resource_id: resourceidarray[csvData[i].resource_name], text: val["project_name"], start_date: val["start_date"], end_date: val["end_date"], isAlreadyLive: "false", parent: resourceidarray[csvData[i].resource_name], open: true
              })

            jQuery.each(projectfilterdata, function (k, val) {
              if (!dupescountry[val["country_name"]]) {
                dupescountry[val["country_name"]] = true;
                {

                  resource_consolidation_view.push(
                    {
                      node: 'country', id: resourceidarray[csvData[i].resource_name].toString() + countryidarray[val["country_name"]].toString() + projectidarray[val["project_name"]].toString(), country_id: countryidarray[val["country_name"]], resource_id: resourceidarray[csvData[i].resource_name], project_id: projectidarray[val["project_name"]], text: val["country_name"], start_date: val["start_date"], end_date: val["end_date"], isAlreadyLive: "false", parent: resourceidarray[csvData[i].resource_name].toString() + projectidarray[val["project_name"]].toString()
                    })
                }
              }
            });
          }
        }
      });

    }
  }
});


console.log(project_consolidation_view);
console.log(country_consolidation_view);
console.log(resource_consolidation_view);

country_consolidation_view = { "data": (country_consolidation_view) }
project_consolidation_view = { "data": (project_consolidation_view) }
resource_consolidation_view = { "data": (resource_consolidation_view) }
var jdeProjectId; var gssProjectId;
for (var i in project_consolidation_view.data) {
  var task = project_consolidation_view.data[i];
  if (task.text == "JDE") {
    jdeProjectId = task.project_id;
  } else if (task.text == "GSS") {
    gssProjectId = task.project_id;
  }
}
tasks = project_consolidation_view


// tasks = project_consolidation_view
//country_list = { "2000": "North America", "2001": "Switzerland", "2002": "Portugal", "2003": "Hong Kong", "2004": "United Kingdom", "2005": "France", "2006": "Spain", "2007": "Germany", "2008": "Italy", "2009": "Japan", "2010": "Korea", "2011": "Australasia", "2012": "Singapore", "2013": "Mexico", "2014": "Indonesia", "2015": "Norway", "2016": "9G Singapore", "2017": "Thailand", "2018": "EMEA Consolidation", "2019": "Knutsen", "2020": "Romania", "2021": "Finland", "2022": "Morocco", "2023": "Turkey", "2024": "Vietnam", "2025": "Uruguay", "2026": "OSFC", "2027": "Malaysia", "2028": "India", "2029": "South Africa", "2030": "EPC", "2031": "Denmark", "2032": "Jpn/Schindler", "2033": "CEAM", "2034": "Otis Elec/QOEC(cpq)", "2035": "Chile", "2036": "CEAM Ph1", "2037": "Argentina", "2038": "Qatar", "2039": "UAE", "2040": "CEAM Ph2", "2041": "CEAM Ph3", "2042": "Central America", "2043": "Colombia", "2044": "NA HQ", "2045": "Sweden", "2046": "Taiwan", "2047": "CEAM Ph4", "2048": "Buga(mfg)", "2049": "Czech Rep", "2050": "Slovakia", "2051": "Breclav", "2052": "India(mfg)", "2053": "OSC", "2054": "CEAM Paravia", "2055": "Austria", "2056": "Bahrain", "2057": "Gien", "2058": "Saudi Arabia", "2059": "Kuwait/AGB", "2060": "OCL (cpq)", "2061": "OCL(mfg)", "2062": "Otis Elec/QOEC(mfg)", "2063": "Netherlands", "2064": "Estonia", "2065": "Ireland", "2066": "Latvia", "2067": "Russia", "2068": "UK", "2069": "Florence", "2070": "Kenya", "2071": "Express(mfg)", "2072": "Argenteuil", "2073": "Brazil", "2074": "Express(cpq)", "2075": "HRCLC", "2076": "Ukraine", "2077": "Belgium", "2078": "Bulgaria", "2079": "Egypt", "2080": "Luxembourg", "2081": "Brazil(mfg)", "2082": "Madrid", "2083": "Greece/Cyprus", "2084": "Hungary", "2085": "Slovenia", "2086": "St.Petersburg", "2087": "Croa/Bos/Serb", "2088": "Otis Electric", "2089": "China" };
country_list = countryidarray
for (var i in country_list) {
  var option = new Option(i, country_list[i]); $('#country_consolidation_view').append($(option));
}
//project_list = { "3000": "GSS", "3001": "JDE", "3002": "eLOG", "3003": "iOT", "3004": "eService", "3005": "Work Day/GHR", "3006": "Kronos", "3007": "Windchill (Configurator)", "3008": "Spare Parts App", "3009": "T Kit", "3010": "Customer Portal", "3011": "Otis.com", "3012": "Xclass", "3013": "Supplier Portal", "3014": "FRS", "3015": "NE Variation Order", "3016": "NE Survey", "3017": "NE Integrated", "3018": "NE Learning", "3019": "NE Digital Hub", "3020": "NE Integrated AA" };
project_list = projectidarray
for (var i in project_list) {
  var option = new Option(i, project_list[i]); $('#project_consolidation_view').append($(option));
}

resource_list = resourceidarray
for (var i in resource_list) {
  var option = new Option(i, resource_list[i]); $('#resource_consolidation_view').append($(option));
}
gantt.init("gantt_here");
gantt.parse(tasks);
