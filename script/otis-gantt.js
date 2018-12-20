//var FolderPath = "http://35.188.173.90/ganttChart/CSV/CurrentFile/";
// var ArchiveFolderPath = "http://35.188.173.90/ganttChart/CSV/Archive/";
//var APIPath = "http://35.188.173.90/ganttChart/api/CSV/";


var FolderPath = "http://localhost:63562/CSV/CurrentFile/";
var ArchiveFolderPath = "http://localhost:63562/CSV/Archive/";
var APIPath = "http://localhost:63562/api/CSV/";
var selectedviewType = "program_consolidation_view", countryData; var project_wise_data; var tasks;
var selectedprogramId = 0; var selectedregionId = 0; var selectedresourceId = 0; var selectedcountryId = 0;
var selectedprogramText = "0"; var selectedregionText = "0"; var selectedresourceText = "0"; var selectedcountryText = "0";
projectidarray = [];
countryidarray = [];
resourceidarray = [];
regionidarray = [];


$(document).ready(function () {
  getExcelData('Roadmap.xlsx', false)
});
function hidehistory() {
  $("#historyDiv").hide();
}
function showHistory() {
  //alert('hi')
  jQuery.ajax({
    url: APIPath + 'GetArchive', // Specify the path to your API service
    type: 'GET',              // Assuming creation of an entity
    contentType: false,        // To force multipart/form-data
    //data: data,
    processData: false,
    success: function (data) {
      // Handle the response on success

      // alert(JSON.stringify(data));
      createHistoryData(data)
      $("#historyDiv").show();
    }
  });
}
function createHistoryData(data) {
  // alert(JSON.stringify(data));
  var str = "<thead><th>File name (DDMMYYYY HHMMSS)</th> <th  style='width: 20%;'></th> <th><a class='link'  onclick=hidehistory() ><img class='cancel'  src='assets/cancel.png' /></a></th></thead><tbody>";
  for (var i = 0; i < data.length; i++) {
    if (i == 0) {
      str = str + "<tr class='selectedrow'>";
    } else {
      str = str + "<tr>";
    }

    str = str + "<td>" + data[i].file_name + "</td>";
    str = str + "<td>" + "<a class='link' href=" + ArchiveFolderPath + data[i].file_name + ">Download</a></td>";
    str = str + "<td>" + "<a class='link'  onclick=uploadHistoryFile('" + data[i].file_name + "') >Apply</a></td>";
    str = str + "</tr>";

  }
  str = str + "</tbody>";
  document.getElementById('historyTable').innerHTML = str
}

function handleFileSelect() {

  let input = document.querySelector('input[type="file"]');
  if (input.value == "") {
    alert("choose file");
  } else {
    var fileExt = input.value;
    var validExts = new Array(input.accept);

    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
      alert("Invalid file selected, valid files are of " +
        validExts.toString() + " types.");
      return false;
    } else {
      let data = new FormData();
      data.append('file', input.files[0]);

      jQuery.ajax({
        url: APIPath + 'UploadExcelFile', // Specify the path to your API service
        type: 'POST',              // Assuming creation of an entity
        contentType: false,        // To force multipart/form-data
        data: data,
        processData: false,
        success: function (data) {
          // Handle the response on success
          // alert(JSON.stringify(data));
          //location.reload();
          projectidarray = [];
          countryidarray = [];
          resourceidarray = [];
          regionidarray = [];
          getExcelData('Roadmap.xlsx', false)
        }
      });

    }
  }
}
gantt.config.duration_unit = "month";//an hour
gantt.config.row_height = 20;

gantt.date.quarter_start = function (date) {
  gantt.date.month_start(date);
  var m = date.getMonth(),
    res_month;
  //alert(date)
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
  //{ unit: "quarter", step: 1, template: quarterLabel }
  { unit: "month", step: 1, date: "%M" }
];
gantt.config.scale_unit = "year";
gantt.config.step = 1;
/*  gantt.config.subscales = [
                           {unit:"quarter", step:1, date:"Quarter #%q"}
                       ]; */
gantt.config.date_scale = "%Y";

gantt.config.columns = [
  { name: "text", label: "Program Name", tree: true, width: 150 },
  { name: "start_date", label: "Start Date", align: "center" },
  { name: "end_date", label: "End Date", align: "center" }

];

function applyfilter() {
  var filterData = "";
  filterData = query(csvData, [{ key: 'project_name', value: selectedprogramText }, { key: 'region_name', value: selectedregionText }, { key: 'resource1_name', value: selectedresourceText }])
  createGanttChart(filterData);
}
function changeSelectedProject(selectionId) {

  if (selectionId == 0 ||selectionId.value=="0" ) {
    selectedprogramId = "0"
    selectedprogramText = "0"
  } else {

    selectedprogramId = selectionId.value; // reset
    selectedprogramText = selectionId.options[selectionId.selectedIndex].innerText;
  }
  applyfilter()
}

function changeSelectedRegion(selectionId) {
  if (selectionId == 0 ||selectionId.value=="0" ) {
    selectedregionId = "0"
    selectedregionText = "0"
  } else {

    selectedregionId = selectionId.value;
    selectedregionText = selectionId.options[selectionId.selectedIndex].innerText;
  }
  applyfilter()
}

function changeSelectedResource(selectionId) {

  if (selectionId == 0 ||selectionId.value=="0" ) {
    selectedresourceId = "0"
    selectedresourceText = "0"
  } else {

    selectedresourceId = selectionId.value;
    selectedresourceText = selectionId.options[selectionId.selectedIndex].innerText;
  }
  applyfilter()
}

function ColorLuminance(hex, lum) {

  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  lum = lum || 0;

  // convert to decimal and change luminosity
  var rgb = "#", c, i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
    rgb += ("00" + c).substr(c.length);
  }

  return rgb;
}
function changeColor(color) {
  gantt.clearAll(); gantt.parse(tasks);
}
function toggleView(viewType, selectionId) {
  selectedviewType = viewType;
  if (viewType == 'program_consolidation_view') {
    // $("#region_consolidation_view").hide(); $("#program_consolidation_view").show(); $("#resource_consolidation_view").hide();
    $("#map_view").hide(); $("#gantt_selection_criteria").show();
    $("#gantt_view").show();
    $("#program_consolidation_view").val(selectionId);
    return changeSelectedProject(selectionId);
  } else if (viewType == 'region_consolidation_view') {
    //$("#region_consolidation_view").show(); $("#program_consolidation_view").hide(); $("#resource_consolidation_view").hide();
    $("#map_view").hide(); $("#gantt_selection_criteria").show();
    $("#gantt_view").show();
    $("#region_consolidation_view").val(selectionId);
    return changeSelectedRegion(selectionId);
  } else if (viewType == 'resource_consolidation_view') {
    //$("#resource_consolidation_view").show(); $("#program_consolidation_view").hide(); $("#region_consolidation_view").hide();
    $("#map_view").hide(); $("#gantt_selection_criteria").show();
    $("#gantt_view").show();
    $("#resource_consolidation_view").val(selectionId);
    return changeSelectedResource(selectionId);
  } else if (viewType == 'map_view') {
    $("#map_view").show(); $("#gantt_selection_criteria").hide();
    $("#region_consolidation_view").hide(); $("#program_consolidation_view").hide();
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
var $greentobluerange = $(".js-greentobluerange-slider");

var valueData = ["Q1-2018", "Q2-2018", "Q3-2018", "Q4-2018",
  "Q1-2019", "Q2-2019", "Q3-2019", "Q4-2019", "Q1-2020",
  "Q2-2020", "Q3-2020", "Q4-2020", "Q1-2021", "Q2-2021",
  "Q3-2021", "Q4-2021", "Q1-2022", "Q2-2022", "Q3-2022",
  "Q4-2022", "Q1-2023", "Q2-2023", "Q3-2023", "Q4-2023",
  "Q1-2024", "Q2-2024", "Q3-2024", "Q4-2024", "Q1-2025",
  "Q2-2025", "Q3-2025", "Q4-2025"];
$greentobluerange.ionRangeSlider({
  values: valueData,
  type: "double",
  from: 0,
  to: 4,
  grid: true,
  onChange: function (data) {
    onSliderChange(data);
  }
});

var slider = $greentobluerange.data("ionRangeSlider");
function moveToNext() {
  var value = $greentobluerange.prop("value").split(";");
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
function getExcelData(filename, IsApplyFilter) {
  // alert(filename)
  var roadMapData = "", colorData = "";

  jQuery.ajax({
    url: APIPath + 'GetAllExcelData?filename=' + filename, // Specify the path to your API service
    type: 'GET',              // Assuming creation of an entity
    //contentType: false,        // To force multipart/form-data
    contentType: "application/x-www-form-urlencoded",
    dataType: "JSON",
    // data: {"filename":"sampleCSV.csv"},
    processData: false,
    success: function (result) {
      roadMapData = result[0].excelRoadMapdata;
      colorData = result[0].excelColordata;
      csvData = roadMapData;
      $("#historyDiv").hide();
      createGanttChart(roadMapData, IsApplyFilter)

    }
  });
}
function uploadHistoryFile(filename) {
  jQuery.ajax({
    url: APIPath + 'uploadHistoryFile?filename=' + filename, // Specify the path to your API service
    type: 'POST',              // Assuming creation of an entity
    //contentType: false,        // To force multipart/form-data
    contentType: "application/x-www-form-urlencoded",
    dataType: "JSON",
    // data: {"filename":"sampleCSV.csv"},
    processData: false,
    success: function (result) {

      $("#historyDiv").hide();
      projectidarray = [];
      countryidarray = [];
      resourceidarray = [];
      regionidarray = [];
      getExcelData('Roadmap.xlsx', false);

    }
  });
}
function createGanttChart(csvData, IsApplyFilter) {
  //  alert(IsApplyFilter);
  program_consolidation_view = []
  region_consolidation_view = []
  resource_consolidation_view = []


  projectcolorarray = [];
  countrycolorarray = [];
  resourcecolorarray = [];
  regioncolorarray = [];

  projectid = 0, countryid = 0, resourceid = 0; regionid = 0;

  dupesproject = [];
  dupescountry = [];
  dupesresource = [];
  dupesregion = [];
  dupescolorarray = [];
  var nodecolor = "#655f61";;
  var startdates = null, enddates = null, earliest = null, latest = null;
  console.log('filter data')
  console.log(csvData)
  jQuery.each(csvData, function (i, programval) {
    if (!dupesproject[csvData[i].project_name]) {

      dupesproject[csvData[i].project_name] = true;
      {
        dupescountry = [];
        if (projectidarray[csvData[i].project_name] == undefined) {
          projectidarray[csvData[i].project_name] = projectid + 1


          projectcolorarray[csvData[i].project_name] = nodecolor;
          projectid = projectid + 1;
        }

        projectfilterdata = query(csvData, [{ key: 'project_name', value: csvData[i].project_name }])
        startdates = projectfilterdata.map(function (x) { return new Date(getdate(x["start_date"])); })
        enddates = projectfilterdata.map(function (x) { return new Date(getdate(x["end_date"])); })
        //console.log(projectfilterdata)
        earliest = new Date(Math.min.apply(null, startdates));
        latest = new Date(Math.max.apply(null, enddates));

        program_consolidation_view.push(
          {
            node: 'program', color: projectcolorarray[csvData[i].project_name], level: 0, id: projectidarray[csvData[i].project_name], project_id: projectidarray[csvData[i].project_name], text: projectfilterdata[0].project_name, start_date: earliest, end_date: latest, open: false
          })

        jQuery.each(projectfilterdata, function (j, Countryval) {
          if (!dupescountry[Countryval["country_name"]]) {
            dupescountry[Countryval["country_name"]] = true;
            {
              dupesresource = []
              countryfilterdata = query(csvData, [{ key: 'project_name', value: csvData[i].project_name }, { key: 'country_name', value: Countryval["country_name"] }])
              startdates = countryfilterdata.map(function (x) { return new Date(getdate(x["start_date"])); })
              enddates = countryfilterdata.map(function (x) { return new Date(getdate(x["end_date"])); })
              //console.log(projectfilterdata)
              earliest = new Date(Math.min.apply(null, startdates));
              latest = new Date(Math.max.apply(null, enddates));
              if (countryidarray[Countryval["country_name"]] == undefined) {
                countryidarray[Countryval["country_name"]] = countryid + 1

                countrycolorarray[Countryval["country_name"]] = nodecolor;
                countryid = countryid + 1;
              }


              program_consolidation_view.push(
                {
                  node: 'country', color: countrycolorarray[Countryval["country_name"]], level: 1, id: projectidarray[csvData[i].project_name].toString() + "00" + countryidarray[Countryval["country_name"]].toString(), country_id: countryidarray[Countryval["country_name"]], project_id: projectidarray[csvData[i].project_name].toString(), text: Countryval["country_name"], start_date: earliest, end_date: latest, isAlreadyLive: "false", parent: projectidarray[csvData[i].project_name], open: false
                })

              jQuery.each(countryfilterdata, function (k, resourceval) {
                if (!dupesresource[resourceval["resource1_name"]]) {
                  dupesresource[resourceval["resource1_name"]] = true;
                  {

                    if (resourceidarray[resourceval["resource1_name"]] == undefined) {
                      resourceidarray[resourceval["resource1_name"]] = resourceid + 1

                      resourcecolorarray[resourceval["resource1_name"]] = nodecolor;
                      resourceid = resourceid + 1;
                    }

                    program_consolidation_view.push(
                      {
                        node: 'resource', color: resourcecolorarray[resourceval["resource1_name"]], level: 2, id: projectidarray[csvData[i].project_name].toString() + "00" + countryidarray[Countryval["country_name"]].toString() + "00" + resourceidarray[resourceval["resource1_name"]].toString(), country_id: countryidarray[Countryval["country_name"]], project_id: projectidarray[csvData[i].project_name].toString(), resource_id: resourceidarray[resourceval["resource1_name"]], text: resourceval["resource1_name"], start_date: resourceval["start_date"], end_date: resourceval["end_date"], isAlreadyLive: "false", parent: projectidarray[csvData[i].project_name].toString() + "00" + countryidarray[Countryval["country_name"]].toString()
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
  dupesregion = [];

  jQuery.each(csvData, function (l, val) {
    if (!dupesregion[csvData[l].region_name]) {
      dupesregion[csvData[l].region_name] = true;
      {
        dupescountry = [];
        if (regionidarray[csvData[l].region_name] == undefined) {
          regionidarray[csvData[l].region_name] = regionid + 1

          regionid = regionid + 1;
        }
        regionfilterdata = query(csvData, [{ key: 'region_name', value: csvData[l].region_name }])
        startdates = regionfilterdata.map(function (x) { return new Date(getdate(x["start_date"])); })
        enddates = regionfilterdata.map(function (x) { return new Date(getdate(x["end_date"])); })
        //console.log(projectfilterdata)
        earliest = new Date(Math.min.apply(null, startdates));
        latest = new Date(Math.max.apply(null, enddates));
        region_consolidation_view.push(
          {
            node: 'region', color: countrycolorarray[csvData[l].country_name], level: 0, id: regionidarray[csvData[l].region_name], region_id: regionidarray[csvData[l].region_name], text: regionfilterdata[0].region_name, start_date: earliest, end_date: latest, isAlreadyLive: false, open: false
          })
        jQuery.each(regionfilterdata, function (i, val) {
          if (!dupescountry[csvData[i].country_name]) {
            dupescountry[csvData[i].country_name] = true;
            {
              dupesproject = [];
              //  projectidarray[csvData[i].project_name] = i + 1;
              countryfilterdata = query(csvData, [{ key: 'region_name', value: csvData[l].region_name }, { key: 'country_name', value: val["country_name"] }])
              startdates = countryfilterdata.map(function (x) { return new Date(getdate(x["start_date"])); })
              enddates = countryfilterdata.map(function (x) { return new Date(getdate(x["end_date"])); })
              //console.log(projectfilterdata)
              earliest = new Date(Math.min.apply(null, startdates));
              latest = new Date(Math.max.apply(null, enddates));
              region_consolidation_view.push(
                {
                  node: 'country', color: countrycolorarray[csvData[l].country_name], level: 1, id: regionidarray[csvData[l].region_name] + "00" + countryidarray[val["country_name"]], country_id: countryidarray[val["country_name"]], region_id: regionidarray[csvData[l].region_name], text: val["country_name"], start_date: earliest, end_date: latest, isAlreadyLive: false, parent: regionidarray[csvData[l].region_name], open: false
                })

              jQuery.each(countryfilterdata, function (j, val) {
                if (!dupesproject[val["project_name"]]) {
                  dupesproject[val["project_name"]] = true;
                  {
                    dupesresource = [];
                    projectfilterdata = query(csvData, [{ key: 'region_name', value: csvData[l].region_name }, { key: 'country_name', value: val["country_name"] }, { key: 'project_name', value: val["project_name"] }])
                    startdates = projectfilterdata.map(function (x) { return new Date(getdate(x["start_date"])); })
                    enddates = projectfilterdata.map(function (x) { return new Date(getdate(x["end_date"])); })
                    //console.log(projectfilterdata)
                    earliest = new Date(Math.min.apply(null, startdates));
                    latest = new Date(Math.max.apply(null, enddates));
                    region_consolidation_view.push(
                      {
                        node: 'program', color: projectcolorarray[csvData[i].project_name], level: 2, id: regionidarray[csvData[l].region_name].toString() + "00" + countryidarray[val["country_name"]].toString() + "00" + projectidarray[val["project_name"]].toString(), region_id: regionidarray[csvData[l].region_name], country_id: countryidarray[val["country_name"]], project_id: projectidarray[val["project_name"]], text: val["project_name"], start_date: earliest, end_date: latest, isAlreadyLive: "false", parent: regionidarray[csvData[l].region_name] + "00" + countryidarray[val["country_name"]], open: false
                      })

                    jQuery.each(projectfilterdata, function (k, val) {
                      if (!dupesresource[val["resource1_name"]]) {
                        dupesresource[val["resource1_name"]] = true;

                        {
                          region_consolidation_view.push(
                            {
                              node: 'resource', color: countrycolorarray[csvData[i].country_name], level: 3, id: regionidarray[csvData[l].region_name].toString() + "00" + countryidarray[val["country_name"]].toString() + "00" + projectidarray[val["project_name"]].toString() + "00" + resourceidarray[val["resource1_name"]].toString(), region_id: regionidarray[csvData[l].region_name], country_id: countryidarray[val["country_name"]].toString(), project_id: projectidarray[val["project_name"]], resource_id: resourceidarray[val["resource1_name"]], text: val["resource1_name"], start_date: val["start_date"], end_date: val["end_date"], isAlreadyLive: "false", parent: regionidarray[csvData[l].region_name].toString() + "00" + countryidarray[val["country_name"]].toString() + "00" + projectidarray[val["project_name"]].toString()
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
      }
    }
  });
  console.log(regionidarray);

  dupesproject = [];
  dupescountry = [];
  dupesresource = [];
  dupesregion = [];

  jQuery.each(csvData, function (i, val) {
    if (!dupesresource[csvData[i].resource1_name]) {
      dupesresource[csvData[i].resource1_name] = true;
      {
        dupesproject = [];

        resourcefilterdata = query(csvData, [{ key: 'resource1_name', value: csvData[i].resource1_name }])

        startdates = resourcefilterdata.map(function (x) { return new Date(getdate(x["start_date"])); })
        enddates = resourcefilterdata.map(function (x) { return new Date(getdate(x["end_date"])); })
        //console.log(projectfilterdata)
        earliest = new Date(Math.min.apply(null, startdates));
        latest = new Date(Math.max.apply(null, enddates));

        resource_consolidation_view.push(
          {
            node: 'resource', color: resourcecolorarray[csvData[i].resource1_name], level: 0, id: resourceidarray[csvData[i].resource1_name], resource_id: resourceidarray[csvData[i].resource1_name], text: resourcefilterdata[0].resource1_name, start_date: earliest, end_date: latest, open: false
          })
        jQuery.each(resourcefilterdata, function (k, val) {
          if (!dupesproject[val["project_name"]]) {
            dupesproject[val["project_name"]] = true;
            {

              dupescountry = []
              projectfilterdata = query(csvData, [{ key: 'resource1_name', value: csvData[i].resource1_name }, { key: 'project_name', value: val["project_name"] }])
              startdates = projectfilterdata.map(function (x) { return new Date(getdate(x["start_date"])); })
              enddates = projectfilterdata.map(function (x) { return new Date(getdate(x["end_date"])); })
              //console.log(projectfilterdata)
              earliest = new Date(Math.min.apply(null, startdates));
              latest = new Date(Math.max.apply(null, enddates));
              resource_consolidation_view.push(
                {
                  node: 'program', color: projectcolorarray[val["project_name"]], level: 1, id: resourceidarray[csvData[i].resource1_name].toString() + "00" + projectidarray[val["project_name"]].toString(), resource_id: resourceidarray[csvData[i].resource1_name], project_id: projectidarray[val["project_name"]], text: val["project_name"], start_date: earliest, end_date: latest, isAlreadyLive: "false", parent: resourceidarray[csvData[i].resource1_name].toString(), open: false
                })

              jQuery.each(projectfilterdata, function (j, val) {
                if (!dupescountry[val["country_name"]]) {
                  dupescountry[val["country_name"]] = true;
                  {

                    resource_consolidation_view.push(
                      {
                        node: 'country', color: countrycolorarray[val["country_name"]], level: 2, id: resourceidarray[csvData[i].resource1_name].toString() + "00" + projectidarray[val["project_name"]].toString() + "00" + countryidarray[val["country_name"]].toString(), country_id: countryidarray[val["country_name"]], resource_id: resourceidarray[csvData[i].resource1_name], project_id: projectidarray[val["project_name"]], text: val["country_name"], start_date: val["start_date"], end_date: val["end_date"], isAlreadyLive: "false", parent: resourceidarray[csvData[i].resource1_name] + "00" + projectidarray[val["project_name"]].toString()

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


  console.log(program_consolidation_view);
  console.log(region_consolidation_view);
  console.log(resource_consolidation_view);

  region_consolidation_view = { "data": (region_consolidation_view) }
  program_consolidation_view = { "data": (program_consolidation_view) }
  resource_consolidation_view = { "data": (resource_consolidation_view) }


  country_list = countryidarray
  region_list = regionidarray
  resource_list = resourceidarray

  $('#program_consolidation_view').empty();
  $('#region_consolidation_view').empty();
  $('#resource_consolidation_view').empty();

  $('#program_consolidation_view').append(new Option('All Program', 0));
  $('#region_consolidation_view').append(new Option('All Region', 0));
  $('#resource_consolidation_view').append(new Option('All Resource', 0));


  for (var i in region_list) {
    var option = new Option(i, region_list[i]); $('#region_consolidation_view').append($(option));
  }
  project_list = projectidarray

  for (var i in project_list) {

    var option = new Option(i, project_list[i]);
    $('#program_consolidation_view').append($(option));
  }

  for (var i in resource_list) {
    var option = new Option(i, resource_list[i]); $('#resource_consolidation_view').append($(option));
  }

  $('#program_consolidation_view').val(selectedprogramId);
  $('#region_consolidation_view').val(selectedregionId);
  $('#resource_consolidation_view').val(selectedresourceId);

  if (selectedviewType == 'program_consolidation_view') {
    tasks = program_consolidation_view
  } else if (selectedviewType == 'region_consolidation_view') {
    tasks = region_consolidation_view
  } else if (selectedviewType == 'resource_consolidation_view') {

    tasks = resource_consolidation_view
  }

  gantt.init("gantt_here");
  gantt.parse(tasks);
  changeColor('#655f61')

}

// Query.
query = (csvData, filters) => {

  return csvData.filter((e) => {
    // Found?
    return filters.reduce((found, filter) => {
      if (!(e[filter.key].includes(filter.value == "0" ? e[filter.key] : filter.value))) return false
      return found
    }, true)

  })

}

function getdate(date) {
  var datepart = date.split('-');
  //alert(datepart[0]);
  var date = datepart[0]
  var month = datepart[1]
  var year = datepart[2]
  var newdate = datepart[1] + '-' + datepart[0] + '-' + datepart[2]
  return newdate;
}
// Log.
