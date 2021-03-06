$(window).resize(function(){
 // document.getElementById("historyDiv").style.marginLeft =$(window).width()-550 +"px" 
});
console.log(window.location.host)
var appurl = window.location.host
var FolderPath = ""
var ArchiveFolderPath = "";
var APIPath = ""; APPPath = "";
$.getJSON('assets/apiurl.json', function (data) {
 // console.log(data.apiurl)
  APIPath = data.apiurl;
  APPPath = data.appurl;
});

FolderPath = APPPath + "/CSV/CurrentFile/";
ArchiveFolderPath = APPPath + "/CSV/Archive/";

var filterData = "";
var selectedviewType = "program_consolidation_view", countryData; var project_wise_data; var tasks;
var selectedprogramId = 0; var selectedregionId = 0; var selectedresourceId = 0; var selectedcountryId = 0;
var selectedprogramText = "0"; var selectedregionText = "0"; var selectedresourceText = "0"; var selectedcountryText = "0";
projectidarray = [];
countryidarray = [];
resourceidarray = [];
regionidarray = [];

projectcolorarray = [];
countrycolorarray = [];
resourcecolorarray = [];
regioncolorarray = [];

var roadMapData = "", colorData = "";

function hidehistory() {
 // $("#historyDiv").hide();
}
function showHistory() {
 // document.getElementById("historyDiv").style.marginLeft =$(window).width()-550 +"px" 
  jQuery.ajax({
    url: APIPath + 'getArchive', // Specify the path to your API service
    type: 'GET',              // Assuming creation of an entity
    contentType: false,        // To force multipart/form-data
    //data: data,
    processData: false,
    success: function (data) {
      // Handle the response on success
      createHistoryData(data)
    //  $("#historyDiv").show();
    }
  });
}
function createHistoryData(data) {
  var str = "<thead><th>File name (MMDDYY HHMM)</th> <th  style='width: 20%;'></th> <th><a class='link'  onclick=hidehistory() ><img class='cancel'  src='assets/cancel.png' /></a></th></thead><tbody>";
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
 // $("#historyDiv").hide();
  let input = document.querySelector('input[type="file"]');
  if (input.value == "") {
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
        url: APIPath + 'uploadExcelFile', // Specify the path to your API service
        type: 'POST',              // Assuming creation of an entity
        contentType: false,        // To force multipart/form-data
        data: data,
        processData: false,
        success: function (data) {
          location.reload();
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
  { name: "F_Start_Date", label: "Start Date", align: "center" },
  { name: "F_End_Date", label: "End Date", align: "center" }


];

function applyfilter() {
  createGanttChart(filterData);
}
function changeSelectedProject(selectionId) {

  if (selectionId == 0 || selectionId.value == "0") {
    selectedprogramId = "0"
    selectedprogramText = "0"
  } else {

    selectedprogramId = selectionId.value; // reset
    selectedprogramText = selectionId.options[selectionId.selectedIndex].innerText;
  }
  applyfilter()
}

function changeSelectedRegion(selectionId) {
  if (selectionId == 0 || selectionId.value == "0") {
    selectedregionId = "0"
    selectedregionText = "0"
  } else {

    selectedregionId = selectionId.value;
    selectedregionText = selectionId.options[selectionId.selectedIndex].innerText;
  }
  applyfilter()
}

function changeSelectedResource(selectionId) {

  if (selectionId == 0 || selectionId.value == "0") {
    selectedresourceId = "0"
    selectedresourceText = "0"
  } else {

    selectedresourceId = selectionId.value;
    selectedresourceText = selectionId.options[selectionId.selectedIndex].innerText;
  }
  applyfilter()
}

function changeColor(color) {
  gantt.clearAll(); gantt.parse(tasks);
}
function toggleView(viewType, selectionId) {
  selectedviewType = viewType;
  if (viewType == 'program_consolidation_view') {

    $("#gantt_selection_criteria").show();
    $("#gantt_view").show();
    $("#program_consolidation_view").val(selectionId);
    return changeSelectedProject(selectionId);
  } else if (viewType == 'region_consolidation_view') {

    $("#gantt_selection_criteria").show();
    $("#gantt_view").show();
    $("#region_consolidation_view").val(selectionId);
    return changeSelectedRegion(selectionId);
  } else if (viewType == 'resource_consolidation_view') {

    $("#gantt_selection_criteria").show();
    $("#gantt_view").show();
    $("#resource_consolidation_view").val(selectionId);
    return changeSelectedResource(selectionId);
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
}
function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}
function getAllRoadMapData(result, IsApplyFilter) {
  roadMapData = result[0].excelRoadMapdata;
  colorData = result[0].excelColordata;
  csvData = roadMapData;
//  $("#historyDiv").hide();
  filterData = roadMapData
  createGanttChart(roadMapData, IsApplyFilter)

}
function uploadSharePointFile() {
  jQuery.ajax({
    url: APIPath + 'uploadSharePointFile', // Specify the path to your API service
    type: 'POST',              // Assuming creation of an entity
    //contentType: false,        // To force multipart/form-data
    contentType: "application/x-www-form-urlencoded",
    dataType: "JSON",
    processData: false,
    success: function (result) {
     // $("#historyDiv").hide();
      //location.reload();

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
    processData: false,
    success: function (result) {
     // $("#historyDiv").hide();
      location.reload();

    }
  });
}
function getdate(date) {
  var newdate = "";
  var datepart = date.split('-');
  newdate = datepart[1] + '/' + datepart[0] + '/' + datepart[2]
  return newdate;
}
function mapStartArray(arr) {
  var result = [];
  for (var i = 0; i < arr.length; i++) {
    result[i] = new Date(getdate(arr[i]["start_date"]));
  }
  return result;
}
function mapEndArray(arr) {
  var result = [];
  for (var i = 0; i < arr.length; i++) {
    result[i] = new Date(getdate(arr[i]["end_date"]));
  }

  return result;
}
function createGanttChart(csvData, IsApplyFilter) {
  var options = { month: '2-digit', day: '2-digit', year: 'numeric' };


  program_consolidation_view = []
  region_consolidation_view = []
  resource_consolidation_view = []
  filterData = csvData;


  projectid = 0, countryid = 0, resourceid = 0; regionid = 0;

  dupesproject = [];
  dupescountry = [];
  dupesresource = [];
  dupesregion = [];
  dupescolorarray = [];
  var defaultcolor = "#655f61"

  var startdates = null, enddates = null, earliest = null, latest = null;

  jQuery.each(csvData, function (i, programval) {
    if (!dupesproject[csvData[i].program_name]) {

      dupesproject[csvData[i].program_name] = true;
      {
        dupescountry = [];
        nodecolor = defaultcolor;
        colorfilterdata = colorquery(colorData, [{ key: 'program_name', value: csvData[i].program_name }])
        if (colorfilterdata.length > 0) {
          nodecolor = "#" + colorfilterdata[0].project_color.substring(2, colorfilterdata[0].project_color.length);
        }
        if (projectidarray[csvData[i].program_name] == undefined) {
          projectidarray[csvData[i].program_name] = projectid + 1
          projectcolorarray[csvData[i].program_name] = nodecolor;
          projectid = projectid + 1;
        }

        projectfilterdata = query(csvData, [{ key: 'program_name', value: csvData[i].program_name }])
        startdates = mapStartArray(projectfilterdata)
        enddates = mapEndArray(projectfilterdata)

        earliest = new Date(Math.min.apply(null, startdates));
        latest = new Date(Math.max.apply(null, enddates));

        program_consolidation_view.push(
          {
            node: 'program', F_Start_Date: (earliest.toLocaleDateString('en-US', options)), F_End_Date: (latest.toLocaleDateString('en-US', options)), color: projectcolorarray[csvData[i].program_name], level: 0, id: projectidarray[csvData[i].program_name], project_id: projectidarray[csvData[i].program_name], text: projectfilterdata[0].program_name, start_date: earliest, end_date: latest, open: false
          })

        jQuery.each(projectfilterdata, function (j, Countryval) {
          if (!dupescountry[Countryval["country_name"]]) {
            dupescountry[Countryval["country_name"]] = true;
            {
              dupesresource = []
              countryfilterdata = query(projectfilterdata, [{ key: 'country_name', value: Countryval["country_name"] }])
              startdates = mapStartArray(countryfilterdata)
              enddates = mapEndArray(countryfilterdata)
              earliest = new Date(Math.min.apply(null, startdates));
              latest = new Date(Math.max.apply(null, enddates));
              if (countryidarray[Countryval["country_name"]] == undefined) {
                countryidarray[Countryval["country_name"]] = countryid + 1

                countrycolorarray[Countryval["country_name"]] = nodecolor;
                countryid = countryid + 1;
              }


              program_consolidation_view.push(
                {
                  node: 'country', F_Start_Date: (earliest.toLocaleDateString('en-US', options)), F_End_Date: (latest.toLocaleDateString('en-US', options)), color: projectcolorarray[csvData[i].program_name], level: 1, id: projectidarray[csvData[i].program_name].toString() + "00" + countryidarray[Countryval["country_name"]].toString(), country_id: countryidarray[Countryval["country_name"]], project_id: projectidarray[csvData[i].program_name].toString(), text: Countryval["country_name"], start_date: earliest, end_date: latest, isAlreadyLive: "false", parent: projectidarray[csvData[i].program_name], open: false
                })

              jQuery.each(countryfilterdata, function (k, resourceval) {
                if (!dupesresource[resourceval["resource_name"]]) {
                  dupesresource[resourceval["resource_name"]] = true;
                  {
                    nodecolor = defaultcolor;
                    colorfilterdata = colorquery(colorData, [{ key: 'resource_name', value: resourceval["resource_name"] }])
                    if (colorfilterdata.length > 0) {
                      nodecolor = "#" + colorfilterdata[0].resource_color.substring(2, colorfilterdata[0].resource_color.length);
                    }
                    if (resourceidarray[resourceval["resource_name"]] == undefined) {
                      resourceidarray[resourceval["resource_name"]] = resourceid + 1

                      resourcecolorarray[resourceval["resource_name"]] = nodecolor;
                      resourceid = resourceid + 1;
                    }
                    var startdate, enddate;
                    program_consolidation_view.push(
                      {

                        node: 'resource', F_Start_Date: (earliest.toLocaleDateString('en-US', options)), F_End_Date: (latest.toLocaleDateString('en-US', options)), color: resourcecolorarray[resourceval["resource_name"]], level: 2, id: projectidarray[csvData[i].program_name].toString() + "00" + countryidarray[Countryval["country_name"]].toString() + "00" + resourceidarray[resourceval["resource_name"]].toString(), country_id: countryidarray[Countryval["country_name"]], project_id: projectidarray[csvData[i].program_name].toString(), resource_id: resourceidarray[resourceval["resource_name"]], text: resourceval["resource_name"], start_date: earliest, end_date: latest, isAlreadyLive: "false", parent: projectidarray[csvData[i].program_name].toString() + "00" + countryidarray[Countryval["country_name"]].toString()
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
  dupesregion = [];

  jQuery.each(csvData, function (l, val) {
    if (!dupesregion[csvData[l].region_name]) {
      dupesregion[csvData[l].region_name] = true;
      {
        dupescountry = [];
        nodecolor = defaultcolor;
        colorfilterdata = colorquery(colorData, [{ key: 'region_name', value: csvData[l].region_name }])
        if (colorfilterdata.length > 0) {
          nodecolor = "#" + colorfilterdata[0].region_color.substring(2, colorfilterdata[0].region_color.length);
        }
        if (regionidarray[csvData[l].region_name] == undefined) {
          regionidarray[csvData[l].region_name] = regionid + 1
          regioncolorarray[csvData[l].region_name] = nodecolor;
          regionid = regionid + 1;
        }
        regionfilterdata = query(csvData, [{ key: 'region_name', value: csvData[l].region_name }])
        startdates = mapStartArray(regionfilterdata)
        enddates = mapEndArray(regionfilterdata)

        earliest = new Date(Math.min.apply(null, startdates));
        latest = new Date(Math.max.apply(null, enddates));
        region_consolidation_view.push(
          {
            node: 'region', F_Start_Date: (earliest.toLocaleDateString('en-US', options)), F_End_Date: (latest.toLocaleDateString('en-US', options)), color: regioncolorarray[csvData[l].region_name], level: 0, id: regionidarray[csvData[l].region_name], region_id: regionidarray[csvData[l].region_name], text: regionfilterdata[0].region_name, start_date: earliest, end_date: latest, isAlreadyLive: false, open: false
          })
        jQuery.each(regionfilterdata, function (i, countryval) {
          if (!dupescountry[csvData[i].country_name]) {
            dupescountry[csvData[i].country_name] = true;
            {
              dupesproject = [];
              countryfilterdata = query(regionfilterdata, [{ key: 'country_name', value: countryval["country_name"] }])
              startdates = mapStartArray(countryfilterdata)
              enddates = mapEndArray(countryfilterdata)
              earliest = new Date(Math.min.apply(null, startdates));
              latest = new Date(Math.max.apply(null, enddates));
              region_consolidation_view.push(
                {
                  node: 'country', F_Start_Date: (earliest.toLocaleDateString('en-US', options)), F_End_Date: (latest.toLocaleDateString('en-US', options)), color: regioncolorarray[csvData[l].region_name], level: 1, id: regionidarray[csvData[l].region_name] + "00" + countryidarray[countryval["country_name"]], country_id: countryidarray[countryval["country_name"]], region_id: regionidarray[csvData[l].region_name], text: countryval["country_name"], start_date: earliest, end_date: latest, isAlreadyLive: false, parent: regionidarray[csvData[l].region_name], open: false
                })

              jQuery.each(countryfilterdata, function (j, programval) {
                if (!dupesproject[programval["program_name"]]) {
                  dupesproject[programval["program_name"]] = true;
                  {
                    dupesresource = [];
                    projectfilterdata = query(countryfilterdata, [{ key: 'program_name', value: programval["program_name"] }])
                    startdates = mapStartArray(projectfilterdata)
                    enddates = mapEndArray(projectfilterdata)
                    earliest = new Date(Math.min.apply(null, startdates));
                    latest = new Date(Math.max.apply(null, enddates));
                    region_consolidation_view.push(
                      {
                        node: 'program', F_Start_Date: (earliest.toLocaleDateString('en-US', options)), F_End_Date: (latest.toLocaleDateString('en-US', options)), color: projectcolorarray[programval["program_name"]], level: 2, id: regionidarray[csvData[l].region_name].toString() + "00" + countryidarray[countryval["country_name"]].toString() + "00" + projectidarray[programval["program_name"]].toString(), region_id: regionidarray[csvData[l].region_name], country_id: countryidarray[countryval["country_name"]], project_id: projectidarray[programval["program_name"]], text: programval["program_name"], start_date: earliest, end_date: latest, isAlreadyLive: "false", parent: regionidarray[csvData[l].region_name] + "00" + countryidarray[countryval["country_name"]], open: false
                      })

                    jQuery.each(projectfilterdata, function (k, resourceval) {
                      if (!dupesresource[resourceval["resource_name"]]) {
                        dupesresource[resourceval["resource_name"]] = true;

                        {
                          region_consolidation_view.push(
                            {
                              node: 'resource', F_Start_Date: (earliest.toLocaleDateString('en-US', options)), F_End_Date: (latest.toLocaleDateString('en-US', options)), color: resourcecolorarray[resourceval["resource_name"]], level: 3, id: regionidarray[csvData[l].region_name].toString() + "00" + countryidarray[countryval["country_name"]].toString() + "00" + projectidarray[programval["program_name"]].toString() + "00" + resourceidarray[resourceval["resource_name"]].toString(), region_id: regionidarray[csvData[l].region_name], country_id: countryidarray[val["country_name"]].toString(), project_id: projectidarray[val["program_name"]], resource_id: resourceidarray[resourceval["resource_name"]], text: resourceval["resource_name"], start_date: earliest, end_date: latest, isAlreadyLive: "false", parent: regionidarray[csvData[l].region_name].toString() + "00" + countryidarray[countryval["country_name"]].toString() + "00" + projectidarray[programval["program_name"]].toString()
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

  dupesproject = [];
  dupescountry = [];
  dupesresource = [];
  dupesregion = [];

  jQuery.each(csvData, function (i, val) {
    if (!dupesresource[csvData[i].resource_name]) {
      dupesresource[csvData[i].resource_name] = true;
      {
        dupesproject = [];
        resourcefilterdata = query(csvData, [{ key: 'resource_name', value: csvData[i].resource_name }])
        startdates = mapStartArray(resourcefilterdata)
        enddates = mapEndArray(resourcefilterdata)

        earliest = new Date(Math.min.apply(null, startdates));
        latest = new Date(Math.max.apply(null, enddates));

        resource_consolidation_view.push(
          {
            node: 'resource', F_Start_Date: (earliest.toLocaleDateString('en-US', options)), F_End_Date: (latest.toLocaleDateString('en-US', options)), color: resourcecolorarray[csvData[i].resource_name], level: 0, id: resourceidarray[csvData[i].resource_name], resource_id: resourceidarray[csvData[i].resource_name], text: resourcefilterdata[0].resource_name, start_date: earliest, end_date: latest, open: false
          })
        jQuery.each(resourcefilterdata, function (k, programval) {
          if (!dupesproject[programval["program_name"]]) {
            dupesproject[programval["program_name"]] = true;
            {

              dupescountry = []
              projectfilterdata = query(resourcefilterdata, [{ key: 'program_name', value: programval["program_name"] }])
              startdates = mapStartArray(projectfilterdata)
              enddates = mapEndArray(projectfilterdata)

              earliest = new Date(Math.min.apply(null, startdates));
              latest = new Date(Math.max.apply(null, enddates));
              resource_consolidation_view.push(
                {
                  node: 'program', F_Start_Date: (earliest.toLocaleDateString('en-US', options)), F_End_Date: (latest.toLocaleDateString('en-US', options)), color: projectcolorarray[programval["program_name"]], level: 1, id: resourceidarray[csvData[i].resource_name].toString() + "00" + projectidarray[programval["program_name"]].toString(), resource_id: resourceidarray[csvData[i].resource_name], project_id: projectidarray[programval["program_name"]], text: programval["program_name"], start_date: earliest, end_date: latest, isAlreadyLive: "false", parent: resourceidarray[csvData[i].resource_name].toString(), open: false
                })

              jQuery.each(projectfilterdata, function (j, countryval) {
                if (!dupescountry[countryval["country_name"]]) {
                  dupescountry[countryval["country_name"]] = true;
                  {
                    var countstartdate = null; countenddate = null;
                    countstartdate = new Date(getdate(countryval["start_date"]))
                    countenddate = new Date(getdate(countryval["end_date"]))
                    resource_consolidation_view.push(
                      {
                        node: 'country', F_Start_Date: (countstartdate.toLocaleDateString('en-US', options)), F_End_Date: (countenddate.toLocaleDateString('en-US', options)), color: projectcolorarray[programval["program_name"]], level: 2, id: resourceidarray[csvData[i].resource_name].toString() + "00" + projectidarray[programval["program_name"]].toString() + "00" + countryidarray[countryval["country_name"]].toString(), country_id: countryidarray[countryval["country_name"]], resource_id: resourceidarray[csvData[i].resource_name], project_id: projectidarray[programval["program_name"]], text: countryval["country_name"], start_date: countstartdate, end_date: countenddate, isAlreadyLive: "false", parent: resourceidarray[csvData[i].resource_name] + "00" + projectidarray[programval["program_name"]].toString()

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


  region_consolidation_view = { "data": (region_consolidation_view) }
  program_consolidation_view = { "data": (program_consolidation_view) }
  resource_consolidation_view = { "data": (resource_consolidation_view) }


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
  return countryidarray;
}
// Query.
function query(csvData, filters) {
  return csvData.filter(function (item) {
    for (var key in filters) {
      if (item[filters[key].key] === undefined || item[filters[key].key] != filters[key].value)
        return false;
    }
    return true;
  });

}

function colorquery(colorData, filters) {

  return colorData.filter(function (item) {
    for (var key in filters) {
      if (item[filters[key].key] === undefined || item[filters[key].key] != filters[key].value)
        return false;
    }
    return true;
  });

}


