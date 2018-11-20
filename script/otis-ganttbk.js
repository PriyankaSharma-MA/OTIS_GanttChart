var countryData ; var project_wise_data; var tasks; var selectedCountryId=0;

gantt.config.duration_unit = "quarter";//an hour
gantt.config.row_height = 20;
 gantt.date.quarter_start = function(date){ 
    gantt.date.month_start(date);
    var m = date.getMonth(),
       res_month;
  
    if(m >= 9){
       res_month = 9;
    }else if(m >= 6){
       res_month = 6;
    }else if(m >= 3){
       res_month = 3;
    }else{
       res_month = 0;
    }
  
    date.setMonth(res_month);
    return date;
 };
 gantt.date.add_quarter = function(date, inc){ 
    return gantt.date.add(date, inc*3, "month");
 };
 function quarterLabel(date){
     var month = date.getMonth();
     var q_num;
  
     if(month >= 9){ 
         q_num = 4;
     }else if(month >= 6){
         q_num = 3;
     }else if(month >= 3){
         q_num = 2;
     }else{
         q_num = 1;
     }
     return "Q" + q_num;
 }
  
 gantt.config.subscales = [
     {unit:"quarter", step:1, template:quarterLabel}
    // ,{unit:"month", step:1, date:"%M" }
 ];
 gantt.config.scale_unit = "year";
 gantt.config.step = 1;
/*  gantt.config.subscales = [
                           {unit:"quarter", step:1, date:"Quarter #%q"}
                       ]; */
 gantt.config.date_scale = "%Y";

 gantt.config.columns = [
                    {name:"text", label:"Project Name", tree:true ,width:150 },
                    {name:"start_date", label:"Start time", align: "center" },
                    {name:"duration",   label:"Duration",   align: "center" }
                 ];	                  

gantt.attachEvent("onTaskClick", function(task_id,e){
 var selectedTask = null;
 for(var i in tasks.data){
     if(tasks.data[i].id == task_id){
       selectedTask = tasks.data[i];
     }
   }
 if(selectedTask.parent == 0 ){
   return true;
 }
 var options = [];
 
   if($("#country_consolidation_view").is(":visible")) {
     options = $("select#project_consolidation_view option").
           map(function() {return parseInt($(this).val());}).get();
     if(options.indexOf(selectedTask.project_id) == -1) {
       return true;
     }
     toggleView('project_consolidation_view',selectedTask.project_id);
   }else{
     options = $("select#country_consolidation_view option").
         map(function() {return parseInt($(this).val());}).get();
   if(options.indexOf(selectedTask.country_id) == -1) {
     return true;
   }
     toggleView('country_consolidation_view',selectedTask.country_id);
   }
   
   return false;
});


gantt.templates.task_class  = function(start, end, task){
	if(task.parent == 0){
		return "parent_task";
	}
	if( task.project_id == jdeProjectId ){
		 return "jde_task";
	}else if( task.project_id == gssProjectId ){
		 return "gss_task";
	}
};
 function changeSelectedProject(selectionId) {
  selectedCountryId = 0; // reset
  initCardLayout(); // prepare angular material cards
   tasks = {"data" : []};
   for ( var i in project_consolidation_view.data) {
     var task = project_consolidation_view.data[i];
     if (selectionId == 0
         || (task.project_id == selectionId )
         ) {
       tasks.data.push(task);
     }
   }
   gantt.clearAll();	gantt.parse(tasks);
 }
 
 function changeSelectedCountry(selectionId) {
  selectedCountryId = selectionId;
  initCardLayout(); // prepare angular material cards
  tasks = {"data" : []};
  for ( var i in country_consolidation_view.data) {
    var task = country_consolidation_view.data[i];
    if (selectionId == 0
        || (task.country_id == selectionId )
        ) {
      tasks.data.push(task);
     }
   }
   gantt.clearAll();	gantt.parse(tasks);
   return tasks;
 }

 function changeColor(color){
   for ( var i in tasks.data) {
	   if( tasks.data[i].project_id == jdeProjectId || 
			   tasks.data[i].project_id == gssProjectId ||
			   tasks.data[i].parent == 0){
		   continue;
	   }
	   console.log(tasks.data[i].parent + "-" + tasks.data[i].text);
     tasks.data[i].color = color;
     }
   gantt.clearAll();	gantt.parse(tasks);
 }
 function toggleView(viewType, selectionId) {
 //	$("#country_consolidation_view").toggle(); $("#project_consolidation_view").toggle();
   if (viewType == 'project_consolidation_view') {
     $("#country_consolidation_view").hide(); $("#project_consolidation_view").show();
     $("#map_view").hide();	$("#gantt_selection_criteria").show();
     $("#gantt_view").show();
     $("#project_consolidation_view").val(selectionId);
     return changeSelectedProject(selectionId);
   } else if (viewType == 'country_consolidation_view') {
     $("#country_consolidation_view").show(); $("#project_consolidation_view").hide();
     $("#map_view").hide(); $("#gantt_selection_criteria").show();
     $("#gantt_view").show();
     $("#country_consolidation_view").val(selectionId);
     return  changeSelectedCountry(selectionId);
   } else if(viewType == 'map_view') {
     $("#map_view").show();$("#gantt_selection_criteria").hide();		
     $("#country_consolidation_view").hide(); $("#project_consolidation_view").hide();
     $("#gantt_view").hide();
     
     google.maps.event.trigger(map, 'resize');
   }
 }

country_list = {"2000":"North America","2001":"Switzerland","2002":"Portugal","2003":"Hong Kong","2004":"United Kingdom","2005":"France","2006":"Spain","2007":"Germany","2008":"Italy","2009":"Japan","2010":"Korea","2011":"Australasia","2012":"Singapore","2013":"Mexico","2014":"Indonesia","2015":"Norway","2016":"9G Singapore","2017":"Thailand","2018":"EMEA Consolidation","2019":"Knutsen","2020":"Romania","2021":"Finland","2022":"Morocco","2023":"Turkey","2024":"Vietnam","2025":"Uruguay","2026":"OSFC","2027":"Malaysia","2028":"India","2029":"South Africa","2030":"EPC","2031":"Denmark","2032":"Jpn/Schindler","2033":"CEAM","2034":"Otis Elec/QOEC(cpq)","2035":"Chile","2036":"CEAM Ph1","2037":"Argentina","2038":"Qatar","2039":"UAE","2040":"CEAM Ph2","2041":"CEAM Ph3","2042":"Central America","2043":"Colombia","2044":"NA HQ","2045":"Sweden","2046":"Taiwan","2047":"CEAM Ph4","2048":"Buga(mfg)","2049":"Czech Rep","2050":"Slovakia","2051":"Breclav","2052":"India(mfg)","2053":"OSC","2054":"CEAM Paravia","2055":"Austria","2056":"Bahrain","2057":"Gien","2058":"Saudi Arabia","2059":"Kuwait/AGB","2060":"OCL (cpq)","2061":"OCL(mfg)","2062":"Otis Elec/QOEC(mfg)","2063":"Netherlands","2064":"Estonia","2065":"Ireland","2066":"Latvia","2067":"Russia","2068":"UK","2069":"Florence","2070":"Kenya","2071":"Express(mfg)","2072":"Argenteuil","2073":"Brazil","2074":"Express(cpq)","2075":"HRCLC","2076":"Ukraine","2077":"Belgium","2078":"Bulgaria","2079":"Egypt","2080":"Luxembourg","2081":"Brazil(mfg)","2082":"Madrid","2083":"Greece/Cyprus","2084":"Hungary","2085":"Slovenia","2086":"St.Petersburg","2087":"Croa/Bos/Serb","2088":"Otis Electric","2089":"China"};
for(var i in country_list){
 var option = new Option(country_list[i], i); $('#country_consolidation_view').append($(option));
}
project_list = {"3000":"GSS","3001":"JDE","3002":"eLOG","3003":"iOT","3004":"eService","3005":"Work Day/GHR","3006":"Kronos","3007":"Windchill (Configurator)","3008":"Spare Parts App","3009":"T Kit","3010":"Customer Portal","3011":"Otis.com","3012":"Xclass","3013":"Supplier Portal","3014":"FRS","3015":"NE Variation Order","3016":"NE Survey","3017":"NE Integrated","3018":"NE Learning","3019":"NE Digital Hub","3020":"NE Integrated AA"};
for(var i in project_list){
 var option = new Option(project_list[i], i); $('#project_consolidation_view').append($(option));
}

// Timeline JS

var icon = $('.play');
 icon.click(function() {
   icon.toggleClass('active');
   return false;
 });
 var currentState = "no-play";
 var playTimeline ;
 function runTimeline() {
   if(currentState == "no-play"){
     currentState =  "play";
     //setInterval(moveToNext(), 500);
     playTimeline = setInterval(function () {
         moveToNext();
     }, 1000);
   }else {
     currentState = "no-play";
     clearInterval(playTimeline);
   }
 }
 var $range = $(".js-range-slider");

 var valueData = [ "Q1-2018", "Q2-2018", "Q3-2018", "Q4-2018",
     "Q1-2019", "Q2-2019", "Q3-2019", "Q4-2019", "Q1-2020",
     "Q2-2020", "Q3-2020", "Q4-2020", "Q1-2021", "Q2-2021",
     "Q3-2021", "Q4-2021", "Q1-2022", "Q2-2022", "Q3-2022",
     "Q4-2022", "Q1-2023", "Q2-2023", "Q3-2023", "Q4-2023",
     "Q1-2024", "Q2-2024", "Q3-2024", "Q4-2024", "Q1-2025",
     "Q2-2025", "Q3-2025", "Q4-2025" ];
 $range.ionRangeSlider({
   values : valueData,
   type : "double",
   from : 0,
   to : 4,
   grid : true,
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
     to : nextLastVal
   });
 }

// Map JS

// If you're adding a number of markers, you may want to drop them on the map
   // consecutively rather than all at once. This example shows how to use
   // window.setTimeout() to space your markers' animation.

   var neighborhoods = [
     {lat: 57.51582287, lng:-101.55761719},
     {lat: 46.818188, lng:8.227512},
     {lat: 39.399872, lng: -8.224454},
     {lat: 22.3524918, lng: 113.8468122},{lat: 46.3440362, lng: -5.437133},
     {lat: 45.8849918, lng: -6.9542167},{lat: 39.8742163, lng: -12.7342511},
     {lat: 51.0963397, lng: 5.9554144},{lat: 40.9544374, lng: 3.6936241},
     {lat: 31.7078272, lng: 120.2219073},{lat: 37.9305884, lng: 123.1621725},
     
   ];

   var markers = [];	var map;
   var infowindow;	var contentString = "";	
  
   function initMap() {
     map = new google.maps.Map(document.getElementById('map'), {
       zoom: 2
       ,center: {lat: 54.095259525449464, lng: 13.410}
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
         (function(marker) {
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
 country_consolidation_view = {
     data:[{id:2000,country_id:2000,text:"North America",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2000003014,country_id:2000,project_id:3014,text:"FRS",start_date:"31-01-2016",end_date:"31-12-2018",isAlreadyLive:"false",parent:2000},
           {id:2000003001,country_id:2000,project_id:3001,text:"JDE",start_date:"01-02-2016",end_date:"31-03-2019",isAlreadyLive:"false",parent:2000},
           {id:2000003004,country_id:2000,project_id:3004,text:"eService",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2000},
           {id:2000003008,country_id:2000,project_id:3008,text:"Spare Parts App",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2000},
           {id:2000003000,country_id:2000,project_id:3000,text:"GSS",start_date:"30-09-2017",end_date:"31-12-2018",isAlreadyLive:"false",parent:2000},
           {id:2000003002,country_id:2000,project_id:3002,text:"eLOG",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2000},
           {id:2000003013,country_id:2000,project_id:3013,text:"Supplier Portal",start_date:"01-01-2019",end_date:"30-06-2019",isAlreadyLive:"false",parent:2000},
           {id:2000003003,country_id:2000,project_id:3003,text:"IoT",start_date:"01-04-2018",end_date:"31-12-2018",isAlreadyLive:"false",parent:2000},
           {id:2000003007,country_id:2000,project_id:3007,text:"Windchill (Configurator)",start_date:"31-01-2020",end_date:"31-12-2020",isAlreadyLive:"false",parent:2000},
           {id:2000003005,country_id:2000,project_id:3005,text:"Work Day/GHR",start_date:"31-01-2015",end_date:"31-01-2018",isAlreadyLive:"false",parent:2000},
           {id:2000003009,country_id:2000,project_id:3009,text:"T Kit",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2000},
           {id:2000003010,country_id:2000,project_id:3010,text:"Customer Portal",start_date:"31-12-2017",end_date:"30-06-2018",isAlreadyLive:"false",parent:2000},
           
           {id:2000003015,country_id:2000,project_id:3015,text:"NE Variation Order",start_date:"01-10-2018",end_date:"30-06-2019",isAlreadyLive:"false",parent:2000},
           {id:2000003016,country_id:2000,project_id:3016,text:"NE Survey",start_date:"01-10-2018",end_date:"30-06-2019",isAlreadyLive:"false",parent:2000},
           {id:2000003017,country_id:2000,project_id:3017,text:"NE Integrated",start_date:"01-10-2018",end_date:"31-12-2018",isAlreadyLive:"false",parent:2000},

           
           {id:2001,country_id:2001,text:"Switzerland",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2001003014,country_id:2001,project_id:3014,text:"FRS",start_date:"30-06-2019",end_date:"31-01-2020",isAlreadyLive:"false",parent:2001},
           {id:2001003001,country_id:2001,project_id:3001,text:"JDE",start_date:"01-04-2019",end_date:"31-03-2020",isAlreadyLive:"false",parent:2001},
           {id:2001003004,country_id:2001,project_id:3004,text:"eService",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2001},
           {id:2001003008,country_id:2001,project_id:3008,text:"Spare Parts App",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2001},
           {id:2001003000,country_id:2001,project_id:3000,text:"GSS",start_date:"30-09-2017",end_date:"31-12-2018",isAlreadyLive:"false",parent:2001},
           {id:2001003002,country_id:2001,project_id:3002,text:"eLOG",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2001},

           {id:2001003009,country_id:2001,project_id:3009,text:"T Kit",start_date:"31-01-2018",end_date:"31-01-2018",isAlreadyLive:"false",parent:2001},
           {id:2002,country_id:2002,text:"Portugal",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2002003014,country_id:2002,project_id:3014,text:"FRS",start_date:"31-01-2019",end_date:"31-12-2019",isAlreadyLive:"false",parent:2002},
           {id:2002003001,country_id:2002,project_id:3001,text:"JDE",start_date:"01-01-2019",end_date:"31-12-2019",isAlreadyLive:"false",parent:2002},
           {id:2002003004,country_id:2002,project_id:3004,text:"eService",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2002},
           {id:2002003008,country_id:2002,project_id:3008,text:"Spare Parts App",start_date:"31-01-2018",end_date:"31-01-2018",isAlreadyLive:"false",parent:2002},
           {id:2002003000,country_id:2002,project_id:3000,text:"GSS",start_date:"30-09-2017",end_date:"31-12-2018",isAlreadyLive:"false",parent:2002},
           {id:2002003002,country_id:2002,project_id:3002,text:"eLOG",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2002},

           {id:2002003009,country_id:2002,project_id:3009,text:"T Kit",start_date:"31-01-2018",end_date:"31-01-2018",isAlreadyLive:"false",parent:2002},
           {id:2003,country_id:2003,text:"Hong Kong",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2003003014,country_id:2003,project_id:3014,text:"FRS",start_date:"31-12-2016",end_date:"31-01-2018",isAlreadyLive:"false",parent:2003},
           {id:2003003001,country_id:2003,project_id:3001,text:"JDE",start_date:"01-10-2016",end_date:"09-01-2018",isAlreadyLive:"false",parent:2003},
           {id:2003003004,country_id:2003,project_id:3004,text:"eService",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2003},
           {id:2003003008,country_id:2003,project_id:3008,text:"Spare Parts App",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2003},
           {id:2003003000,country_id:2003,project_id:3000,text:"GSS",start_date:"30-09-2018",end_date:"30-06-2019",isAlreadyLive:"false",parent:2003},
           {id:2003003002,country_id:2003,project_id:3002,text:"eLOG",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2003},           
           {id:2003003003,country_id:2003,project_id:3003,text:"IoT",start_date:"01-04-2018",end_date:"31-12-2018",isAlreadyLive:"false",parent:2003},
           {id:2003003005,country_id:2003,project_id:3005,text:"Work Day/GHR",start_date:"31-01-2017",end_date:"30-06-2018",isAlreadyLive:"false",parent:2003},
           {id:2003003009,country_id:2003,project_id:3009,text:"T Kit",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2003},
           {id:2004,country_id:2004,text:"United Kingdom",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2004003014,country_id:2004,project_id:3014,text:"FRS",start_date:"31-01-2019",end_date:"30-06-2020",isAlreadyLive:"false",parent:2004},
           {id:2004003001,country_id:2004,project_id:3001,text:"JDE",start_date:"01-07-2018",end_date:"31-03-2020",isAlreadyLive:"false",parent:2004},
           {id:2004003004,country_id:2004,project_id:3004,text:"eService",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2004},
           {id:2004003008,country_id:2004,project_id:3008,text:"Spare Parts App",start_date:"31-01-2018",end_date:"30-06-2018",isAlreadyLive:"false",parent:2004},
           {id:2004003000,country_id:2004,project_id:3000,text:"GSS",start_date:"30-09-2019",end_date:"30-09-2020",isAlreadyLive:"false",parent:2004},
           {id:2004003002,country_id:2004,project_id:3002,text:"eLOG",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2004},
           {id:2004003005,country_id:2004,project_id:3005,text:"Work Day/GHR",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2004},
           {id:2004003009,country_id:2004,project_id:3009,text:"T Kit",start_date:"31-01-2018",end_date:"30-06-2018",isAlreadyLive:"false",parent:2004},
           {id:2005,country_id:2005,text:"France",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2005003014,country_id:2005,project_id:3014,text:"FRS",start_date:"30-06-2020",end_date:"30-06-2021",isAlreadyLive:"false",parent:2005},
           {id:2005003001,country_id:2005,project_id:3001,text:"JDE",start_date:"01-04-2020",end_date:"30-06-2021",isAlreadyLive:"false",parent:2005},
           {id:2005003004,country_id:2005,project_id:3004,text:"eService",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2005},
           {id:2005003008,country_id:2005,project_id:3008,text:"Spare Parts App",start_date:"31-12-2017",end_date:"31-01-2018",isAlreadyLive:"false",parent:2005},
           {id:2005003000,country_id:2005,project_id:3000,text:"GSS",start_date:"30-09-2018",end_date:"30-09-2019",isAlreadyLive:"false",parent:2005},
           {id:2005003002,country_id:2005,project_id:3002,text:"eLOG",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2005},

           {id:2005003003,country_id:2005,project_id:3003,text:"IoT",start_date:"01-04-2018",end_date:"31-12-2018",isAlreadyLive:"false",parent:2005},
           {id:2005003007,country_id:2005,project_id:3007,text:"Windchill (Configurator)",start_date:"31-01-2020",end_date:"31-12-2020",isAlreadyLive:"false",parent:2005},
           {id:2005003005,country_id:2005,project_id:3005,text:"Work Day/GHR",start_date:"31-12-2016",end_date:"30-06-2018",isAlreadyLive:"false",parent:2005},
           {id:2005003009,country_id:2005,project_id:3009,text:"T Kit",start_date:"31-12-2017",end_date:"31-01-2018",isAlreadyLive:"false",parent:2005},
           {id:2005003018,country_id:2005,project_id:3018,text:"NE Learning",start_date:"01-04-2018",end_date:"30-09-2018",isAlreadyLive:"false",parent:2005},
           {id:2005003019,country_id:2005,project_id:3019,text:"NE Digital Hub",start_date:"01-04-2018",end_date:"30-09-2018",isAlreadyLive:"false",parent:2005},
           {id:2005003020,country_id:2005,project_id:3020,text:"NE Integrated AA",start_date:"01-10-2018",end_date:"31-12-2018",isAlreadyLive:"false",parent:2005},
           
           {id:2006,country_id:2006,text:"Spain",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2006003014,country_id:2006,project_id:3014,text:"FRS",start_date:"30-06-2020",end_date:"31-01-2021",isAlreadyLive:"false",parent:2006},
           {id:2006003001,country_id:2006,project_id:3001,text:"JDE",start_date:"01-04-2020",end_date:"31-03-2021",isAlreadyLive:"false",parent:2006},
           {id:2006003004,country_id:2006,project_id:3004,text:"eService",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2006},
           {id:2006003008,country_id:2006,project_id:3008,text:"Spare Parts App",start_date:"31-01-2018",end_date:"30-06-2018",isAlreadyLive:"false",parent:2006},
           {id:2006003000,country_id:2006,project_id:3000,text:"GSS",start_date:"30-09-2018",end_date:"30-09-2019",isAlreadyLive:"false",parent:2006},
           {id:2006003002,country_id:2006,project_id:3002,text:"eLOG",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2006},
           {id:2006003007,country_id:2006,project_id:3007,text:"Windchill (Configurator)",start_date:"31-01-2022",end_date:"31-12-2022",isAlreadyLive:"false",parent:2006},
           {id:2006003005,country_id:2006,project_id:3005,text:"Work Day/GHR",start_date:"31-01-2017",end_date:"30-06-2018",isAlreadyLive:"false",parent:2006},
           {id:2006003009,country_id:2006,project_id:3009,text:"T Kit",start_date:"31-01-2018",end_date:"30-06-2018",isAlreadyLive:"false",parent:2006},
           {id:2006003018,country_id:2006,project_id:3018,text:"NE Learning",start_date:"01-04-2018",end_date:"30-09-2018",isAlreadyLive:"false",parent:2006},
           {id:2006003019,country_id:2006,project_id:3019,text:"NE Digital Hub",start_date:"01-04-2018",end_date:"30-09-2018",isAlreadyLive:"false",parent:2006},
           {id:2006003020,country_id:2006,project_id:3020,text:"NE Integrated AA",start_date:"01-10-2018",end_date:"31-12-2018",isAlreadyLive:"false",parent:2006},

           {id:2007,country_id:2007,text:"Germany",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2007003014,country_id:2007,project_id:3014,text:"FRS",start_date:"30-06-2020",end_date:"30-06-2021",isAlreadyLive:"false",parent:2007},
           {id:2007003001,country_id:2007,project_id:3001,text:"JDE",start_date:"01-04-2020",end_date:"30-06-2021",isAlreadyLive:"false",parent:2007},
           {id:2007003004,country_id:2007,project_id:3004,text:"eService",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2007},
           {id:2007003008,country_id:2007,project_id:3008,text:"Spare Parts App",start_date:"31-01-2018",end_date:"30-06-2018",isAlreadyLive:"false",parent:2007},
           {id:2007003000,country_id:2007,project_id:3000,text:"GSS",start_date:"31-12-2019",end_date:"31-01-2021",isAlreadyLive:"false",parent:2007},
           {id:2007003002,country_id:2007,project_id:3002,text:"eLOG",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2007},
  
           {id:2007003009,country_id:2007,project_id:3009,text:"T Kit",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2007},
           {id:2008,country_id:2008,text:"Italy",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2008003014,country_id:2008,project_id:3014,text:"FRS",start_date:"30-06-2019",end_date:"30-06-2020",isAlreadyLive:"false",parent:2008},
           {id:2008003001,country_id:2008,project_id:3001,text:"JDE",start_date:"01-04-2019",end_date:"30-06-2020",isAlreadyLive:"false",parent:2008},
           {id:2008003004,country_id:2008,project_id:3004,text:"eService",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2008},
           {id:2008003008,country_id:2008,project_id:3008,text:"Spare Parts App",start_date:"30-06-2018",end_date:"30-09-2018",isAlreadyLive:"false",parent:2008},
           {id:2008003000,country_id:2008,project_id:3000,text:"GSS",start_date:"31-01-2020",end_date:"31-01-2021",isAlreadyLive:"false",parent:2008},
           {id:2008003002,country_id:2008,project_id:3002,text:"eLOG",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2008},

           {id:2008003009,country_id:2008,project_id:3009,text:"T Kit",start_date:"30-06-2018",end_date:"30-09-2018",isAlreadyLive:"false",parent:2008},
           {id:2009,country_id:2009,text:"Japan",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2009003014,country_id:2009,project_id:3014,text:"FRS",start_date:"31-01-2018",end_date:"31-12-2018",isAlreadyLive:"false",parent:2009},
           {id:2009003001,country_id:2009,project_id:3001,text:"JDE",start_date:"01-07-2018",end_date:"01-04-2019",isAlreadyLive:"false",parent:2009},
           {id:2009003004,country_id:2009,project_id:3004,text:"eService",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2009},
           {id:2009003008,country_id:2009,project_id:3008,text:"Spare Parts App",start_date:"30-06-2018",end_date:"30-09-2018",isAlreadyLive:"false",parent:2009},
           {id:2009003000,country_id:2009,project_id:3000,text:"GSS",start_date:"31-12-2019",end_date:"31-12-2020",isAlreadyLive:"false",parent:2009},
           {id:2009003002,country_id:2009,project_id:3002,text:"eLOG",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2009},

           {id:2009003007,country_id:2009,project_id:3007,text:"Windchill (Configurator)",start_date:"31-01-2022",end_date:"31-12-2022",isAlreadyLive:"false",parent:2009},
           {id:2009003005,country_id:2009,project_id:3005,text:"Work Day/GHR",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2009},
           {id:2009003009,country_id:2009,project_id:3009,text:"T Kit",start_date:"30-06-2018",end_date:"30-09-2018",isAlreadyLive:"false",parent:2009},
           {id:2010,country_id:2010,text:"Korea",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2010003014,country_id:2010,project_id:3014,text:"FRS",start_date:"31-01-2018",end_date:"31-12-2018",isAlreadyLive:"false",parent:2010},
           {id:2010003001,country_id:2010,project_id:3001,text:"JDE",start_date:"01-01-2018",end_date:"31-03-2019",isAlreadyLive:"false",parent:2010},
           {id:2010003004,country_id:2010,project_id:3004,text:"eService",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2010},
           {id:2010003008,country_id:2010,project_id:3008,text:"Spare Parts App",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2010},
           {id:2010003000,country_id:2010,project_id:3000,text:"GSS",start_date:"30-09-2019",end_date:"30-09-2020",isAlreadyLive:"false",parent:2010},
           {id:2010003002,country_id:2010,project_id:3002,text:"eLOG",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2010},

           {id:2010003007,country_id:2010,project_id:3007,text:"Windchill (Configurator)",start_date:"31-01-2022",end_date:"31-12-2022",isAlreadyLive:"false",parent:2010},
           {id:2010003005,country_id:2010,project_id:3005,text:"Work Day/GHR",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2010},
           {id:2010003009,country_id:2010,project_id:3009,text:"T Kit",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:2010},
           {id:2011,country_id:2011,text:"Australasia",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2011003001,country_id:2011,project_id:3001,text:"JDE",start_date:"01-01-2014",end_date:"07-04-2014",isAlreadyLive:"false",parent:2011},
           {id:2012,country_id:2012,text:"Singapore",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2012003001,country_id:2012,project_id:3001,text:"JDE",start_date:"13-08-2014",end_date:"08-05-2015",isAlreadyLive:"false",parent:2012},
           {id:2012003003,country_id:2012,project_id:3003,text:"IoT",start_date:"01-04-2018",end_date:"31-12-2018",isAlreadyLive:"false",parent:2012},
           {id:2013,country_id:2013,text:"Mexico",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2013003001,country_id:2013,project_id:3001,text:"JDE",start_date:"27-08-2014",end_date:"10-08-2015",isAlreadyLive:"false",parent:2013},
           {id:2014,country_id:2014,text:"Indonesia",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2014003001,country_id:2014,project_id:3001,text:"JDE",start_date:"13-01-2015",end_date:"06-01-2016",isAlreadyLive:"false",parent:2014},
           {id:2015,country_id:2015,text:"Norway",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2015003001,country_id:2015,project_id:3001,text:"JDE",start_date:"07-01-2015",end_date:"11-03-2016",isAlreadyLive:"false",parent:2015},
           {id:2016,country_id:2016,text:"9G Singapore",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2016003001,country_id:2016,project_id:3001,text:"JDE",start_date:"01-04-2016",end_date:"07-07-2016",isAlreadyLive:"false",parent:2016},
           {id:2017,country_id:2017,text:"Thailand",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2017003001,country_id:2017,project_id:3001,text:"JDE",start_date:"12-04-2016",end_date:"09-11-2016",isAlreadyLive:"false",parent:2017},
           {id:2018,country_id:2018,text:"EMEA Consolidation",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2018003001,country_id:2018,project_id:3001,text:"JDE",start_date:"01-07-2016",end_date:"05-12-2016",isAlreadyLive:"false",parent:2018},
           {id:2019,country_id:2019,text:"Knutsen",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2019003001,country_id:2019,project_id:3001,text:"JDE",start_date:"01-07-2016",end_date:"25-01-2017",isAlreadyLive:"false",parent:2019},
           {id:2020,country_id:2020,text:"Romania",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2020003001,country_id:2020,project_id:3001,text:"JDE",start_date:"16-02-2016",end_date:"30-01-2017",isAlreadyLive:"false",parent:2020},
           {id:2021,country_id:2021,text:"Finland",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2021003001,country_id:2021,project_id:3001,text:"JDE",start_date:"20-09-2016",end_date:"03-05-2017",isAlreadyLive:"false",parent:2021},
           {id:2022,country_id:2022,text:"Morocco",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2022003001,country_id:2022,project_id:3001,text:"JDE",start_date:"22-03-2016",end_date:"12-05-2017",isAlreadyLive:"false",parent:2022},
           {id:2023,country_id:2023,text:"Turkey",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2023003001,country_id:2023,project_id:3001,text:"JDE",start_date:"01-04-2015",end_date:"17-05-2017",isAlreadyLive:"false",parent:2023},
           {id:2024,country_id:2024,text:"Vietnam",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2024003001,country_id:2024,project_id:3001,text:"JDE",start_date:"22-11-2016",end_date:"14-08-2017",isAlreadyLive:"false",parent:2024},
           {id:2025,country_id:2025,text:"Uruguay",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2025003001,country_id:2025,project_id:3001,text:"JDE",start_date:"01-04-2016",end_date:"17-10-2017",isAlreadyLive:"false",parent:2025},
           {id:2026,country_id:2026,text:"OSFC",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2026003001,country_id:2026,project_id:3001,text:"JDE",start_date:"07-08-2017",end_date:"13-11-2017",isAlreadyLive:"false",parent:2026},
           {id:2027,country_id:2027,text:"Malaysia",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2027003001,country_id:2027,project_id:3001,text:"JDE",start_date:"17-01-2017",end_date:"30-11-2017",isAlreadyLive:"false",parent:2027},
           {id:2028,country_id:2028,text:"India",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2028003001,country_id:2028,project_id:3001,text:"JDE",start_date:"01-10-2016",end_date:"09-03-2018",isAlreadyLive:"false",parent:2028},
           {id:2028003013,country_id:2028,project_id:3013,text:"Supplier Portal",start_date:"01-01-2019",end_date:"30-06-2019",isAlreadyLive:"false",parent:2028},
           {id:2029,country_id:2029,text:"South Africa",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2029003001,country_id:2029,project_id:3001,text:"JDE",start_date:"01-01-2016",end_date:"08-01-2018",isAlreadyLive:"false",parent:2029},
           {id:2030,country_id:2030,text:"EPC",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2030003001,country_id:2030,project_id:3001,text:"JDE",start_date:"20-12-2016",end_date:"29-01-2018",isAlreadyLive:"false",parent:2030},
           {id:2030003013,country_id:2030,project_id:3013,text:"Supplier Portal",start_date:"01-01-2019",end_date:"30-06-2019",isAlreadyLive:"false",parent:2030},
           {id:2031,country_id:2031,text:"Denmark",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2031003001,country_id:2031,project_id:3001,text:"JDE",start_date:"20-06-2017",end_date:"04-02-2018",isAlreadyLive:"false",parent:2031},
           {id:2032,country_id:2032,text:"Jpn/Schindler",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2032003001,country_id:2032,project_id:3001,text:"JDE",start_date:"20-01-2017",end_date:"08-02-2018",isAlreadyLive:"false",parent:2032},
           {id:2033,country_id:2033,text:"CEAM",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2033003001,country_id:2033,project_id:3001,text:"JDE",start_date:"15-10-2017",end_date:"06-04-2018",isAlreadyLive:"false",parent:2033},
           {id:2034,country_id:2034,text:"Otis Elec/QOEC(cpq)",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2034003001,country_id:2034,project_id:3001,text:"JDE",start_date:"31-03-2017",end_date:"09-04-2018",isAlreadyLive:"false",parent:2034},
           {id:2035,country_id:2035,text:"Chile",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2035003001,country_id:2035,project_id:3001,text:"JDE",start_date:"15-11-2017",end_date:"30-06-2018",isAlreadyLive:"false",parent:2035},
           {id:2036,country_id:2036,text:"CEAM Ph1",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2036003001,country_id:2036,project_id:3001,text:"JDE",start_date:"09-04-2018",end_date:"06-07-2018",isAlreadyLive:"false",parent:2036},
           {id:2037,country_id:2037,text:"Argentina",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2037003001,country_id:2037,project_id:3001,text:"JDE",start_date:"01-01-2018",end_date:"30-09-2018",isAlreadyLive:"false",parent:2037},
           {id:2038,country_id:2038,text:"Qatar",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2038003001,country_id:2038,project_id:3001,text:"JDE",start_date:"15-11-2017",end_date:"30-09-2018",isAlreadyLive:"false",parent:2038},
           {id:2039,country_id:2039,text:"UAE",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2039003001,country_id:2039,project_id:3001,text:"JDE",start_date:"15-11-2017",end_date:"30-09-2018",isAlreadyLive:"false",parent:2039},
           {id:2040,country_id:2040,text:"CEAM Ph2",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2040003001,country_id:2040,project_id:3001,text:"JDE",start_date:"09-07-2018",end_date:"05-10-2018",isAlreadyLive:"false",parent:2040},
           {id:2041,country_id:2041,text:"CEAM Ph3",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2041003001,country_id:2041,project_id:3001,text:"JDE",start_date:"17-09-2018",end_date:"09-11-2018",isAlreadyLive:"false",parent:2041},
           {id:2042,country_id:2042,text:"Central America",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2042003001,country_id:2042,project_id:3001,text:"JDE",start_date:"01-07-2018",end_date:"31-12-2018",isAlreadyLive:"false",parent:2042},
           {id:2043,country_id:2043,text:"Colombia",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2043003001,country_id:2043,project_id:3001,text:"JDE",start_date:"01-04-2018",end_date:"31-12-2018",isAlreadyLive:"false",parent:2043},
           {id:2044,country_id:2044,text:"NA HQ",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2044003001,country_id:2044,project_id:3001,text:"JDE",start_date:"01-01-2016",end_date:"31-12-2018",isAlreadyLive:"false",parent:2044},
           {id:2045,country_id:2045,text:"Sweden",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2045003001,country_id:2045,project_id:3001,text:"JDE",start_date:"01-04-2018",end_date:"31-12-2018",isAlreadyLive:"false",parent:2045},
           {id:2046,country_id:2046,text:"Taiwan",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2046003001,country_id:2046,project_id:3001,text:"JDE",start_date:"01-01-2018",end_date:"31-12-2018",isAlreadyLive:"false",parent:2046},
           {id:2047,country_id:2047,text:"CEAM Ph4",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2047003001,country_id:2047,project_id:3001,text:"JDE",start_date:"05-11-2018",end_date:"18-01-2019",isAlreadyLive:"false",parent:2047},
           {id:2048,country_id:2048,text:"Buga(mfg)",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2048003001,country_id:2048,project_id:3001,text:"JDE",start_date:"01-07-2018",end_date:"31-03-2019",isAlreadyLive:"false",parent:2048},
           {id:2049,country_id:2049,text:"Czech Rep",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2049003001,country_id:2049,project_id:3001,text:"JDE",start_date:"01-04-2018",end_date:"31-03-2019",isAlreadyLive:"false",parent:2049},
           {id:2050,country_id:2050,text:"Slovakia",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2050003001,country_id:2050,project_id:3001,text:"JDE",start_date:"01-04-2018",end_date:"31-03-2019",isAlreadyLive:"false",parent:2050},
           {id:2051,country_id:2051,text:"Breclav",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2051003001,country_id:2051,project_id:3001,text:"JDE",start_date:"01-10-2018",end_date:"30-06-2019",isAlreadyLive:"false",parent:2051},
           {id:2052,country_id:2052,text:"India(mfg)",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2052003001,country_id:2052,project_id:3001,text:"JDE",start_date:"01-07-2018",end_date:"30-06-2019",isAlreadyLive:"false",parent:2052},
           {id:2053,country_id:2053,text:"OSC",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2053003001,country_id:2053,project_id:3001,text:"JDE",start_date:"01-01-2018",end_date:"30-06-2019",isAlreadyLive:"false",parent:2053},
           {id:2054,country_id:2054,text:"CEAM Paravia",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2054003001,country_id:2054,project_id:3001,text:"JDE",start_date:"21-01-2019",end_date:"12-07-2019",isAlreadyLive:"false",parent:2054},
           {id:2055,country_id:2055,text:"Austria",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2055003001,country_id:2055,project_id:3001,text:"JDE",start_date:"01-10-2018",end_date:"30-09-2019",isAlreadyLive:"false",parent:2055},
           {id:2055003003,country_id:2055,project_id:3003,text:"IoT",start_date:"01-04-2018",end_date:"31-12-2018",isAlreadyLive:"false",parent:2055},
           {id:2056,country_id:2056,text:"Bahrain",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2056003001,country_id:2056,project_id:3001,text:"JDE",start_date:"01-01-2019",end_date:"30-09-2019",isAlreadyLive:"false",parent:2056},
           {id:2057,country_id:2057,text:"Gien",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2057003001,country_id:2057,project_id:3001,text:"JDE",start_date:"01-10-2018",end_date:"30-09-2019",isAlreadyLive:"false",parent:2057},
           {id:2058,country_id:2058,text:"Saudi Arabia",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2058003001,country_id:2058,project_id:3001,text:"JDE",start_date:"01-01-2019",end_date:"30-09-2019",isAlreadyLive:"false",parent:2058},
           {id:2059,country_id:2059,text:"Kuwait/AGB",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2059003001,country_id:2059,project_id:3001,text:"JDE",start_date:"01-01-2019",end_date:"31-12-2019",isAlreadyLive:"false",parent:2059},
           {id:2060,country_id:2060,text:"OCL (cpq)",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2060003001,country_id:2060,project_id:3001,text:"JDE",start_date:"01-07-2018",end_date:"31-12-2019",isAlreadyLive:"false",parent:2060},
           {id:2061,country_id:2061,text:"OCL(mfg)",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2061003001,country_id:2061,project_id:3001,text:"JDE",start_date:"01-04-2019",end_date:"31-12-2019",isAlreadyLive:"false",parent:2061},
           {id:2062,country_id:2062,text:"Otis Elec/QOEC(mfg)",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2062003001,country_id:2062,project_id:3001,text:"JDE",start_date:"01-01-2019",end_date:"31-12-2019",isAlreadyLive:"false",parent:2062},
           {id:2063,country_id:2063,text:"Netherlands",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2063003001,country_id:2063,project_id:3001,text:"JDE",start_date:"01-04-2019",end_date:"31-03-2020",isAlreadyLive:"false",parent:2063},
           {id:2064,country_id:2064,text:"Estonia",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2064003001,country_id:2064,project_id:3001,text:"JDE",start_date:"01-01-2020",end_date:"30-06-2020",isAlreadyLive:"false",parent:2064},
           {id:2065,country_id:2065,text:"Ireland",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2065003001,country_id:2065,project_id:3001,text:"JDE",start_date:"01-01-2019",end_date:"30-06-2020",isAlreadyLive:"false",parent:2065},
           {id:2066,country_id:2066,text:"Latvia",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2066003001,country_id:2066,project_id:3001,text:"JDE",start_date:"01-01-2020",end_date:"30-06-2020",isAlreadyLive:"false",parent:2066},
           {id:2067,country_id:2067,text:"Russia",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2067003001,country_id:2067,project_id:3001,text:"JDE",start_date:"01-04-2019",end_date:"30-06-2020",isAlreadyLive:"false",parent:2067},
           {id:2068,country_id:2068,text:"UK",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2068003001,country_id:2068,project_id:3001,text:"JDE",start_date:"01-01-2019",end_date:"30-06-2020",isAlreadyLive:"false",parent:2068},
           {id:2069,country_id:2069,text:"Florence",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2069003001,country_id:2069,project_id:3001,text:"JDE",start_date:"01-10-2019",end_date:"30-09-2020",isAlreadyLive:"false",parent:2069},
           {id:2070,country_id:2070,text:"Kenya",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2070003001,country_id:2070,project_id:3001,text:"JDE",start_date:"01-01-2020",end_date:"30-09-2020",isAlreadyLive:"false",parent:2070},
           {id:2071,country_id:2071,text:"Express(mfg)",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2071003001,country_id:2071,project_id:3001,text:"JDE",start_date:"01-01-2020",end_date:"30-12-2020",isAlreadyLive:"false",parent:2071},
           {id:2072,country_id:2072,text:"Argenteuil",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2072003001,country_id:2072,project_id:3001,text:"JDE",start_date:"01-01-2020",end_date:"31-12-2020",isAlreadyLive:"false",parent:2072},
           {id:2073,country_id:2073,text:"Brazil",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2073003001,country_id:2073,project_id:3001,text:"JDE",start_date:"01-07-2019",end_date:"31-12-2022",isAlreadyLive:"false",parent:2073},
           {id:2074,country_id:2074,text:"Express(cpq)",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2074003001,country_id:2074,project_id:3001,text:"JDE",start_date:"01-01-2020",end_date:"31-12-2020",isAlreadyLive:"false",parent:2074},
           {id:2075,country_id:2075,text:"HRCLC",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2075003001,country_id:2075,project_id:3001,text:"JDE",start_date:"01-07-2020",end_date:"30-06-2021",isAlreadyLive:"false",parent:2075},
           {id:2076,country_id:2076,text:"Ukraine",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2076003001,country_id:2076,project_id:3001,text:"JDE",start_date:"01-07-2020",end_date:"30-06-2021",isAlreadyLive:"false",parent:2076},
           {id:2077,country_id:2077,text:"Belgium",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2077003001,country_id:2077,project_id:3001,text:"JDE",start_date:"01-01-2021",end_date:"30-09-2021",isAlreadyLive:"false",parent:2077},
           {id:2078,country_id:2078,text:"Bulgaria",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2078003001,country_id:2078,project_id:3001,text:"JDE",start_date:"01-01-2021",end_date:"30-09-2021",isAlreadyLive:"false",parent:2078},
           {id:2079,country_id:2079,text:"Egypt",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2079003001,country_id:2079,project_id:3001,text:"JDE",start_date:"01-01-2021",end_date:"30-09-2021",isAlreadyLive:"false",parent:2079},
           {id:2080,country_id:2080,text:"Luxembourg",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2080003001,country_id:2080,project_id:3001,text:"JDE",start_date:"01-01-2021",end_date:"30-09-2021",isAlreadyLive:"false",parent:2080},
           {id:2081,country_id:2081,text:"Brazil(mfg)",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2081003001,country_id:2081,project_id:3001,text:"JDE",start_date:"01-01-2021",end_date:"31-12-2021",isAlreadyLive:"false",parent:2081},
           {id:2082,country_id:2082,text:"Madrid",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2082003001,country_id:2082,project_id:3001,text:"JDE",start_date:"01-04-2021",end_date:"31-12-2021",isAlreadyLive:"false",parent:2082},
           {id:2083,country_id:2083,text:"Greece/Cyprus",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2083003001,country_id:2083,project_id:3001,text:"JDE",start_date:"01-07-2021",end_date:"30-06-2022",isAlreadyLive:"false",parent:2083},
           {id:2084,country_id:2084,text:"Hungary",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2084003001,country_id:2084,project_id:3001,text:"JDE",start_date:"01-10-2021",end_date:"30-06-2022",isAlreadyLive:"false",parent:2084},
           {id:2085,country_id:2085,text:"Slovenia",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2085003001,country_id:2085,project_id:3001,text:"JDE",start_date:"01-10-2021",end_date:"30-06-2022",isAlreadyLive:"false",parent:2085},
           {id:2086,country_id:2086,text:"St.Petersburg",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2086003001,country_id:2086,project_id:3001,text:"JDE",start_date:"01-07-2021",end_date:"30-06-2022",isAlreadyLive:"false",parent:2086},
           {id:2087,country_id:2087,text:"Croa/Bos/Serb",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2087003001,country_id:2087,project_id:3001,text:"JDE",start_date:"01-10-2021",end_date:"30-09-2022",isAlreadyLive:"false",parent:2087},
           {id:2088,country_id:2088,text:"Otis Electric",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2088003013,country_id:2088,project_id:3013,text:"Supplier Portal",start_date:"01-01-2019",end_date:"30-06-2019",isAlreadyLive:"false",parent:2088},
           {id:2089,country_id:2089,text:"China",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:2089003003,country_id:2089,project_id:3003,text:"IoT",start_date:"01-04-2018",end_date:"31-12-2018",isAlreadyLive:"false",parent:2089}
           ]
     };

 project_consolidation_view = {
     data:[{id:3000,project_id:3000,text:"GSS",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:3000002000,country_id:2000,project_id:3000,text:"North America",start_date:"30-09-2017",end_date:"31-12-2018",isAlreadyLive:"false",parent:3000},
           {id:3000002001,country_id:2001,project_id:3000,text:"Switzerland",start_date:"30-09-2017",end_date:"31-12-2018",isAlreadyLive:"false",parent:3000},
           {id:3000002002,country_id:2002,project_id:3000,text:"Portugal",start_date:"30-09-2017",end_date:"31-12-2018",isAlreadyLive:"false",parent:3000},
           {id:3000002003,country_id:2003,project_id:3000,text:"Hong Kong",start_date:"30-09-2018",end_date:"30-06-2019",isAlreadyLive:"false",parent:3000},
           {id:3000002004,country_id:2004,project_id:3000,text:"United Kingdom",start_date:"30-09-2019",end_date:"30-09-2020",isAlreadyLive:"false",parent:3000},
           {id:3000002005,country_id:2005,project_id:3000,text:"France",start_date:"30-09-2018",end_date:"30-09-2019",isAlreadyLive:"false",parent:3000},
           {id:3000002006,country_id:2006,project_id:3000,text:"Spain",start_date:"30-09-2018",end_date:"30-09-2019",isAlreadyLive:"false",parent:3000},
           {id:3000002007,country_id:2007,project_id:3000,text:"Germany",start_date:"31-12-2019",end_date:"31-01-2021",isAlreadyLive:"false",parent:3000},
           {id:3000002008,country_id:2008,project_id:3000,text:"Italy",start_date:"31-01-2020",end_date:"31-01-2021",isAlreadyLive:"false",parent:3000},
           {id:3000002009,country_id:2009,project_id:3000,text:"Japan",start_date:"31-12-2019",end_date:"31-12-2020",isAlreadyLive:"false",parent:3000},
           {id:3000002010,country_id:2010,project_id:3000,text:"Korea",start_date:"30-09-2019",end_date:"30-09-2020",isAlreadyLive:"false",parent:3000},
           {id:3001,project_id:3001,text:"JDE",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:3001002000,country_id:2000,project_id:3001,text:"North America",start_date:"01-02-2016",end_date:"31-03-2019",isAlreadyLive:"false",parent:3001},
           {id:3001002001,country_id:2001,project_id:3001,text:"Switzerland",start_date:"01-04-2019",end_date:"31-03-2020",isAlreadyLive:"false",parent:3001},
           {id:3001002002,country_id:2002,project_id:3001,text:"Portugal",start_date:"01-01-2019",end_date:"31-12-2019",isAlreadyLive:"false",parent:3001},
           {id:3001002003,country_id:2003,project_id:3001,text:"Hong Kong",start_date:"01-10-2016",end_date:"09-01-2018",isAlreadyLive:"false",parent:3001},
           {id:3001002004,country_id:2004,project_id:3001,text:"United Kingdom",start_date:"01-07-2018",end_date:"31-03-2020",isAlreadyLive:"false",parent:3001},
           {id:3001002005,country_id:2005,project_id:3001,text:"France",start_date:"01-04-2020",end_date:"30-06-2021",isAlreadyLive:"false",parent:3001},
           {id:3001002006,country_id:2006,project_id:3001,text:"Spain",start_date:"01-04-2020",end_date:"31-03-2021",isAlreadyLive:"false",parent:3001},
           {id:3001002007,country_id:2007,project_id:3001,text:"Germany",start_date:"01-04-2020",end_date:"30-06-2021",isAlreadyLive:"false",parent:3001},
           {id:3001002008,country_id:2008,project_id:3001,text:"Italy",start_date:"01-04-2019",end_date:"30-06-2020",isAlreadyLive:"false",parent:3001},
           {id:3001002009,country_id:2009,project_id:3001,text:"Japan",start_date:"01-07-2018",end_date:"01-04-2019",isAlreadyLive:"false",parent:3001},
           {id:3001002010,country_id:2010,project_id:3001,text:"Korea",start_date:"01-01-2018",end_date:"31-03-2019",isAlreadyLive:"false",parent:3001},
           {id:3001002011,country_id:2011,project_id:3001,text:"Australasia",start_date:"01-01-2014",end_date:"07-04-2014",isAlreadyLive:"false",parent:3001},
           {id:3001002012,country_id:2012,project_id:3001,text:"Singapore",start_date:"13-08-2014",end_date:"08-05-2015",isAlreadyLive:"false",parent:3001},
           {id:3001002013,country_id:2013,project_id:3001,text:"Mexico",start_date:"27-08-2014",end_date:"10-08-2015",isAlreadyLive:"false",parent:3001},
           {id:3001002014,country_id:2014,project_id:3001,text:"Indonesia",start_date:"13-01-2015",end_date:"06-01-2016",isAlreadyLive:"false",parent:3001},
           {id:3001002015,country_id:2015,project_id:3001,text:"Norway",start_date:"07-01-2015",end_date:"11-03-2016",isAlreadyLive:"false",parent:3001},
           {id:3001002016,country_id:2016,project_id:3001,text:"9G Singapore",start_date:"01-04-2016",end_date:"07-07-2016",isAlreadyLive:"false",parent:3001},
           {id:3001002017,country_id:2017,project_id:3001,text:"Thailand",start_date:"12-04-2016",end_date:"09-11-2016",isAlreadyLive:"false",parent:3001},
           {id:3001002018,country_id:2018,project_id:3001,text:"EMEA Consolidation",start_date:"01-07-2016",end_date:"05-12-2016",isAlreadyLive:"false",parent:3001},
           {id:3001002019,country_id:2019,project_id:3001,text:"Knutsen",start_date:"01-07-2016",end_date:"25-01-2017",isAlreadyLive:"false",parent:3001},
           {id:3001002020,country_id:2020,project_id:3001,text:"Romania",start_date:"16-02-2016",end_date:"30-01-2017",isAlreadyLive:"false",parent:3001},
           {id:3001002021,country_id:2021,project_id:3001,text:"Finland",start_date:"20-09-2016",end_date:"03-05-2017",isAlreadyLive:"false",parent:3001},
           {id:3001002022,country_id:2022,project_id:3001,text:"Morocco",start_date:"22-03-2016",end_date:"12-05-2017",isAlreadyLive:"false",parent:3001},
           {id:3001002023,country_id:2023,project_id:3001,text:"Turkey",start_date:"01-04-2015",end_date:"17-05-2017",isAlreadyLive:"false",parent:3001},
           {id:3001002024,country_id:2024,project_id:3001,text:"Vietnam",start_date:"22-11-2016",end_date:"14-08-2017",isAlreadyLive:"false",parent:3001},
           {id:3001002025,country_id:2025,project_id:3001,text:"Uruguay",start_date:"01-04-2016",end_date:"17-10-2017",isAlreadyLive:"false",parent:3001},
           {id:3001002026,country_id:2026,project_id:3001,text:"OSFC",start_date:"07-08-2017",end_date:"13-11-2017",isAlreadyLive:"false",parent:3001},
           {id:3001002027,country_id:2027,project_id:3001,text:"Malaysia",start_date:"17-01-2017",end_date:"30-11-2017",isAlreadyLive:"false",parent:3001},
           {id:3001002028,country_id:2028,project_id:3001,text:"India",start_date:"01-10-2016",end_date:"09-03-2018",isAlreadyLive:"false",parent:3001},
           {id:3001002029,country_id:2029,project_id:3001,text:"South Africa",start_date:"01-01-2016",end_date:"08-01-2018",isAlreadyLive:"false",parent:3001},
           {id:3001002030,country_id:2030,project_id:3001,text:"EPC",start_date:"20-12-2016",end_date:"29-01-2018",isAlreadyLive:"false",parent:3001},
           {id:3001002031,country_id:2031,project_id:3001,text:"Denmark",start_date:"20-06-2017",end_date:"04-02-2018",isAlreadyLive:"false",parent:3001},
           {id:3001002032,country_id:2032,project_id:3001,text:"Jpn/Schindler",start_date:"20-01-2017",end_date:"08-02-2018",isAlreadyLive:"false",parent:3001},
           {id:3001002033,country_id:2033,project_id:3001,text:"CEAM",start_date:"15-10-2017",end_date:"06-04-2018",isAlreadyLive:"false",parent:3001},
           {id:3001002034,country_id:2034,project_id:3001,text:"Otis Elec/QOEC(cpq)",start_date:"31-03-2017",end_date:"09-04-2018",isAlreadyLive:"false",parent:3001},
           {id:3001002035,country_id:2035,project_id:3001,text:"Chile",start_date:"15-11-2017",end_date:"30-06-2018",isAlreadyLive:"false",parent:3001},
           {id:3001002036,country_id:2036,project_id:3001,text:"CEAM Ph1",start_date:"09-04-2018",end_date:"06-07-2018",isAlreadyLive:"false",parent:3001},
           {id:3001002037,country_id:2037,project_id:3001,text:"Argentina",start_date:"01-01-2018",end_date:"30-09-2018",isAlreadyLive:"false",parent:3001},
           {id:3001002038,country_id:2038,project_id:3001,text:"Qatar",start_date:"15-11-2017",end_date:"30-09-2018",isAlreadyLive:"false",parent:3001},
           {id:3001002039,country_id:2039,project_id:3001,text:"UAE",start_date:"15-11-2017",end_date:"30-09-2018",isAlreadyLive:"false",parent:3001},
           {id:3001002040,country_id:2040,project_id:3001,text:"CEAM Ph2",start_date:"09-07-2018",end_date:"05-10-2018",isAlreadyLive:"false",parent:3001},
           {id:3001002041,country_id:2041,project_id:3001,text:"CEAM Ph3",start_date:"17-09-2018",end_date:"09-11-2018",isAlreadyLive:"false",parent:3001},
           {id:3001002042,country_id:2042,project_id:3001,text:"Central America",start_date:"01-07-2018",end_date:"31-12-2018",isAlreadyLive:"false",parent:3001},
           {id:3001002043,country_id:2043,project_id:3001,text:"Colombia",start_date:"01-04-2018",end_date:"31-12-2018",isAlreadyLive:"false",parent:3001},
           {id:3001002044,country_id:2044,project_id:3001,text:"NA HQ",start_date:"01-01-2016",end_date:"31-12-2018",isAlreadyLive:"false",parent:3001},
           {id:3001002045,country_id:2045,project_id:3001,text:"Sweden",start_date:"01-04-2018",end_date:"31-12-2018",isAlreadyLive:"false",parent:3001},
           {id:3001002046,country_id:2046,project_id:3001,text:"Taiwan",start_date:"01-01-2018",end_date:"31-12-2018",isAlreadyLive:"false",parent:3001},
           {id:3001002047,country_id:2047,project_id:3001,text:"CEAM Ph4",start_date:"05-11-2018",end_date:"18-01-2019",isAlreadyLive:"false",parent:3001},
           {id:3001002048,country_id:2048,project_id:3001,text:"Buga(mfg)",start_date:"01-07-2018",end_date:"31-03-2019",isAlreadyLive:"false",parent:3001},
           {id:3001002049,country_id:2049,project_id:3001,text:"Czech Rep",start_date:"01-04-2018",end_date:"31-03-2019",isAlreadyLive:"false",parent:3001},
           {id:3001002050,country_id:2050,project_id:3001,text:"Slovakia",start_date:"01-04-2018",end_date:"31-03-2019",isAlreadyLive:"false",parent:3001},
           {id:3001002051,country_id:2051,project_id:3001,text:"Breclav",start_date:"01-10-2018",end_date:"30-06-2019",isAlreadyLive:"false",parent:3001},
           {id:3001002052,country_id:2052,project_id:3001,text:"India(mfg)",start_date:"01-07-2018",end_date:"30-06-2019",isAlreadyLive:"false",parent:3001},
           {id:3001002053,country_id:2053,project_id:3001,text:"OSC",start_date:"01-01-2018",end_date:"30-06-2019",isAlreadyLive:"false",parent:3001},
           {id:3001002054,country_id:2054,project_id:3001,text:"CEAM Paravia",start_date:"21-01-2019",end_date:"12-07-2019",isAlreadyLive:"false",parent:3001},
           {id:3001002055,country_id:2055,project_id:3001,text:"Austria",start_date:"01-10-2018",end_date:"30-09-2019",isAlreadyLive:"false",parent:3001},
           {id:3001002056,country_id:2056,project_id:3001,text:"Bahrain",start_date:"01-01-2019",end_date:"30-09-2019",isAlreadyLive:"false",parent:3001},
           {id:3001002057,country_id:2057,project_id:3001,text:"Gien",start_date:"01-10-2018",end_date:"30-09-2019",isAlreadyLive:"false",parent:3001},
           {id:3001002058,country_id:2058,project_id:3001,text:"Saudi Arabia",start_date:"01-01-2019",end_date:"30-09-2019",isAlreadyLive:"false",parent:3001},
           {id:3001002059,country_id:2059,project_id:3001,text:"Kuwait/AGB",start_date:"01-01-2019",end_date:"31-12-2019",isAlreadyLive:"false",parent:3001},
           {id:3001002060,country_id:2060,project_id:3001,text:"OCL (cpq)",start_date:"01-07-2018",end_date:"31-12-2019",isAlreadyLive:"false",parent:3001},
           {id:3001002061,country_id:2061,project_id:3001,text:"OCL(mfg)",start_date:"01-04-2019",end_date:"31-12-2019",isAlreadyLive:"false",parent:3001},
           {id:3001002062,country_id:2062,project_id:3001,text:"Otis Elec/QOEC(mfg)",start_date:"01-01-2019",end_date:"31-12-2019",isAlreadyLive:"false",parent:3001},
           {id:3001002063,country_id:2063,project_id:3001,text:"Netherlands",start_date:"01-04-2019",end_date:"31-03-2020",isAlreadyLive:"false",parent:3001},
           {id:3001002064,country_id:2064,project_id:3001,text:"Estonia",start_date:"01-01-2020",end_date:"30-06-2020",isAlreadyLive:"false",parent:3001},
           {id:3001002065,country_id:2065,project_id:3001,text:"Ireland",start_date:"01-01-2019",end_date:"30-06-2020",isAlreadyLive:"false",parent:3001},
           {id:3001002066,country_id:2066,project_id:3001,text:"Latvia",start_date:"01-01-2020",end_date:"30-06-2020",isAlreadyLive:"false",parent:3001},
           {id:3001002067,country_id:2067,project_id:3001,text:"Russia",start_date:"01-04-2019",end_date:"30-06-2020",isAlreadyLive:"false",parent:3001},
           {id:3001002068,country_id:2068,project_id:3001,text:"UK",start_date:"01-01-2019",end_date:"30-06-2020",isAlreadyLive:"false",parent:3001},
           {id:3001002069,country_id:2069,project_id:3001,text:"Florence",start_date:"01-10-2019",end_date:"30-09-2020",isAlreadyLive:"false",parent:3001},
           {id:3001002070,country_id:2070,project_id:3001,text:"Kenya",start_date:"01-01-2020",end_date:"30-09-2020",isAlreadyLive:"false",parent:3001},
           {id:3001002071,country_id:2071,project_id:3001,text:"Express(mfg)",start_date:"01-01-2020",end_date:"30-12-2020",isAlreadyLive:"false",parent:3001},
           {id:3001002072,country_id:2072,project_id:3001,text:"Argenteuil",start_date:"01-01-2020",end_date:"31-12-2020",isAlreadyLive:"false",parent:3001},
           {id:3001002073,country_id:2073,project_id:3001,text:"Brazil",start_date:"01-07-2019",end_date:"31-12-2022",isAlreadyLive:"false",parent:3001},
           {id:3001002074,country_id:2074,project_id:3001,text:"Express(cpq)",start_date:"01-01-2020",end_date:"31-12-2020",isAlreadyLive:"false",parent:3001},
           {id:3001002075,country_id:2075,project_id:3001,text:"HRCLC",start_date:"01-07-2020",end_date:"30-06-2021",isAlreadyLive:"false",parent:3001},
           {id:3001002076,country_id:2076,project_id:3001,text:"Ukraine",start_date:"01-07-2020",end_date:"30-06-2021",isAlreadyLive:"false",parent:3001},
           {id:3001002077,country_id:2077,project_id:3001,text:"Belgium",start_date:"01-01-2021",end_date:"30-09-2021",isAlreadyLive:"false",parent:3001},
           {id:3001002078,country_id:2078,project_id:3001,text:"Bulgaria",start_date:"01-01-2021",end_date:"30-09-2021",isAlreadyLive:"false",parent:3001},
           {id:3001002079,country_id:2079,project_id:3001,text:"Egypt",start_date:"01-01-2021",end_date:"30-09-2021",isAlreadyLive:"false",parent:3001},
           {id:3001002080,country_id:2080,project_id:3001,text:"Luxembourg",start_date:"01-01-2021",end_date:"30-09-2021",isAlreadyLive:"false",parent:3001},
           {id:3001002081,country_id:2081,project_id:3001,text:"Brazil(mfg)",start_date:"01-01-2021",end_date:"31-12-2021",isAlreadyLive:"false",parent:3001},
           {id:3001002082,country_id:2082,project_id:3001,text:"Madrid",start_date:"01-04-2021",end_date:"31-12-2021",isAlreadyLive:"false",parent:3001},
           {id:3001002083,country_id:2083,project_id:3001,text:"Greece/Cyprus",start_date:"01-07-2021",end_date:"30-06-2022",isAlreadyLive:"false",parent:3001},
           {id:3001002084,country_id:2084,project_id:3001,text:"Hungary",start_date:"01-10-2021",end_date:"30-06-2022",isAlreadyLive:"false",parent:3001},
           {id:3001002085,country_id:2085,project_id:3001,text:"Slovenia",start_date:"01-10-2021",end_date:"30-06-2022",isAlreadyLive:"false",parent:3001},
           {id:3001002086,country_id:2086,project_id:3001,text:"St.Petersburg",start_date:"01-07-2021",end_date:"30-06-2022",isAlreadyLive:"false",parent:3001},
           {id:3001002087,country_id:2087,project_id:3001,text:"Croa/Bos/Serb",start_date:"01-10-2021",end_date:"30-09-2022",isAlreadyLive:"false",parent:3001},
           {id:3002,project_id:3002,text:"eLOG",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:3002002000,country_id:2000,project_id:3002,text:"North America",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3002},
           {id:3002002001,country_id:2001,project_id:3002,text:"Switzerland",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3002},
           {id:3002002002,country_id:2002,project_id:3002,text:"Portugal",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3002},
           {id:3002002003,country_id:2003,project_id:3002,text:"Hong Kong",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3002},
           {id:3002002004,country_id:2004,project_id:3002,text:"United Kingdom",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3002},
           {id:3002002005,country_id:2005,project_id:3002,text:"France",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3002},
           {id:3002002006,country_id:2006,project_id:3002,text:"Spain",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3002},
           {id:3002002007,country_id:2007,project_id:3002,text:"Germany",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3002},
           {id:3002002008,country_id:2008,project_id:3002,text:"Italy",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3002},
           {id:3002002009,country_id:2009,project_id:3002,text:"Japan",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3002},
           {id:3002002010,country_id:2010,project_id:3002,text:"Korea",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3002},
           {id:3003,project_id:3003,text:"iOT",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:3003002000,country_id:2000,project_id:3003,text:"North America",start_date:"01-04-2018",end_date:"31-12-2018",isAlreadyLive:"false",parent:3003},
           {id:3003002003,country_id:2003,project_id:3003,text:"Hong Kong",start_date:"01-04-2018",end_date:"31-12-2018",isAlreadyLive:"false",parent:3003},
           {id:3003002005,country_id:2005,project_id:3003,text:"France",start_date:"01-04-2018",end_date:"31-12-2018",isAlreadyLive:"false",parent:3003},
           {id:3003002089,country_id:2089,project_id:3003,text:"China",start_date:"01-04-2018",end_date:"31-12-2018",isAlreadyLive:"false",parent:3003},
           {id:3003002012,country_id:2012,project_id:3003,text:"Singapore",start_date:"01-04-2018",end_date:"31-12-2018",isAlreadyLive:"false",parent:3003},
           {id:3003002055,country_id:2055,project_id:3003,text:"Austria",start_date:"01-04-2018",end_date:"31-12-2018",isAlreadyLive:"false",parent:3003},
           {id:3004,project_id:3004,text:"eService",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:3004002000,country_id:2000,project_id:3004,text:"North America",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3004},
           {id:3004002001,country_id:2001,project_id:3004,text:"Switzerland",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3004},
           {id:3004002002,country_id:2002,project_id:3004,text:"Portugal",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3004},
           {id:3004002003,country_id:2003,project_id:3004,text:"Hong Kong",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3004},
           {id:3004002004,country_id:2004,project_id:3004,text:"United Kingdom",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3004},
           {id:3004002005,country_id:2005,project_id:3004,text:"France",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3004},
           {id:3004002006,country_id:2006,project_id:3004,text:"Spain",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3004},
           {id:3004002007,country_id:2007,project_id:3004,text:"Germany",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3004},
           {id:3004002008,country_id:2008,project_id:3004,text:"Italy",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3004},
           {id:3004002009,country_id:2009,project_id:3004,text:"Japan",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3004},
           {id:3004002010,country_id:2010,project_id:3004,text:"Korea",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3004},
           {id:3005,project_id:3005,text:"Work Day/GHR",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:3005002000,country_id:2000,project_id:3005,text:"North America",start_date:"31-01-2015",end_date:"31-01-2018",isAlreadyLive:"false",parent:3005},
           {id:3005002003,country_id:2003,project_id:3005,text:"Hong Kong",start_date:"31-01-2017",end_date:"30-06-2018",isAlreadyLive:"false",parent:3005},
           {id:3005002004,country_id:2004,project_id:3005,text:"United Kingdom",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3005},
           {id:3005002005,country_id:2005,project_id:3005,text:"France",start_date:"31-12-2016",end_date:"30-06-2018",isAlreadyLive:"false",parent:3005},
           {id:3005002006,country_id:2006,project_id:3005,text:"Spain",start_date:"31-01-2017",end_date:"30-06-2018",isAlreadyLive:"false",parent:3005},
           {id:3005002009,country_id:2009,project_id:3005,text:"Japan",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3005},
           {id:3005002010,country_id:2010,project_id:3005,text:"Korea",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3005},
           {id:3007,project_id:3007,text:"Windchill (Configurator)",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:3007002000,country_id:2000,project_id:3007,text:"North America",start_date:"31-01-2020",end_date:"31-12-2020",isAlreadyLive:"false",parent:3007},
           {id:3007002005,country_id:2005,project_id:3007,text:"France",start_date:"31-01-2020",end_date:"31-12-2020",isAlreadyLive:"false",parent:3007},
           {id:3007002006,country_id:2006,project_id:3007,text:"Spain",start_date:"31-01-2022",end_date:"31-12-2022",isAlreadyLive:"false",parent:3007},
           {id:3007002009,country_id:2009,project_id:3007,text:"Japan",start_date:"31-01-2022",end_date:"31-12-2022",isAlreadyLive:"false",parent:3007},
           {id:3007002010,country_id:2010,project_id:3007,text:"Korea",start_date:"31-01-2022",end_date:"31-12-2022",isAlreadyLive:"false",parent:3007},
           {id:3008,project_id:3008,text:"Spare Parts App",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:3008002000,country_id:2000,project_id:3008,text:"North America",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3008},
           {id:3008002001,country_id:2001,project_id:3008,text:"Switzerland",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3008},
           {id:3008002002,country_id:2002,project_id:3008,text:"Portugal",start_date:"31-01-2018",end_date:"31-01-2018",isAlreadyLive:"false",parent:3008},
           {id:3008002003,country_id:2003,project_id:3008,text:"Hong Kong",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3008},
           {id:3008002004,country_id:2004,project_id:3008,text:"United Kingdom",start_date:"31-01-2018",end_date:"30-06-2018",isAlreadyLive:"false",parent:3008},
           {id:3008002005,country_id:2005,project_id:3008,text:"France",start_date:"31-12-2017",end_date:"31-01-2018",isAlreadyLive:"false",parent:3008},
           {id:3008002006,country_id:2006,project_id:3008,text:"Spain",start_date:"31-01-2018",end_date:"30-06-2018",isAlreadyLive:"false",parent:3008},
           {id:3008002007,country_id:2007,project_id:3008,text:"Germany",start_date:"31-01-2018",end_date:"30-06-2018",isAlreadyLive:"false",parent:3008},
           {id:3008002008,country_id:2008,project_id:3008,text:"Italy",start_date:"30-06-2018",end_date:"30-09-2018",isAlreadyLive:"false",parent:3008},
           {id:3008002009,country_id:2009,project_id:3008,text:"Japan",start_date:"30-06-2018",end_date:"30-09-2018",isAlreadyLive:"false",parent:3008},
           {id:3008002010,country_id:2010,project_id:3008,text:"Korea",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3008},
           {id:3009,project_id:3009,text:"T Kit",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:3009002000,country_id:2000,project_id:3009,text:"North America",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3009},
           {id:3009002001,country_id:2001,project_id:3009,text:"Switzerland",start_date:"31-01-2018",end_date:"31-01-2018",isAlreadyLive:"false",parent:3009},
           {id:3009002002,country_id:2002,project_id:3009,text:"Portugal",start_date:"31-01-2018",end_date:"31-01-2018",isAlreadyLive:"false",parent:3009},
           {id:3009002003,country_id:2003,project_id:3009,text:"Hong Kong",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3009},
           {id:3009002004,country_id:2004,project_id:3009,text:"United Kingdom",start_date:"31-01-2018",end_date:"30-06-2018",isAlreadyLive:"false",parent:3009},
           {id:3009002005,country_id:2005,project_id:3009,text:"France",start_date:"31-12-2017",end_date:"31-01-2018",isAlreadyLive:"false",parent:3009},
           {id:3009002006,country_id:2006,project_id:3009,text:"Spain",start_date:"31-01-2018",end_date:"30-06-2018",isAlreadyLive:"false",parent:3009},
           {id:3009002007,country_id:2007,project_id:3009,text:"Germany",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3009},
           {id:3009002008,country_id:2008,project_id:3009,text:"Italy",start_date:"30-06-2018",end_date:"30-09-2018",isAlreadyLive:"false",parent:3009},
           {id:3009002009,country_id:2009,project_id:3009,text:"Japan",start_date:"30-06-2018",end_date:"30-09-2018",isAlreadyLive:"false",parent:3009},
           {id:3009002010,country_id:2010,project_id:3009,text:"Korea",start_date:"01-01-2017",end_date:"01-01-2017",isAlreadyLive:"true",parent:3009},
           {id:3010,project_id:3010,text:"Customer Portal",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:3010002000,country_id:2000,project_id:3010,text:"North America",start_date:"31-12-2017",end_date:"30-06-2018",isAlreadyLive:"false",parent:3010},
           {id:3013,project_id:3013,text:"Supplier Portal",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:3013002000,country_id:2000,project_id:3013,text:"North America",start_date:"01-01-2019",end_date:"30-06-2019",isAlreadyLive:"false",parent:3013},
           {id:3013002088,country_id:2088,project_id:3013,text:"Otis Electric",start_date:"01-01-2019",end_date:"30-06-2019",isAlreadyLive:"false",parent:3013},
           {id:3013002028,country_id:2028,project_id:3013,text:"India",start_date:"01-01-2019",end_date:"30-06-2019",isAlreadyLive:"false",parent:3013},
           {id:3013002030,country_id:2030,project_id:3013,text:"EPC",start_date:"01-01-2019",end_date:"30-06-2019",isAlreadyLive:"false",parent:3013},

           {id:3014,project_id:3014,text:"FRS",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:3014002000,country_id:2000,project_id:3014,text:"North America",start_date:"31-01-2016",end_date:"31-12-2018",isAlreadyLive:"false",parent:3014},
           {id:3014002001,country_id:2001,project_id:3014,text:"Switzerland",start_date:"30-06-2019",end_date:"31-01-2020",isAlreadyLive:"false",parent:3014},
           {id:3014002002,country_id:2002,project_id:3014,text:"Portugal",start_date:"31-01-2019",end_date:"31-12-2019",isAlreadyLive:"false",parent:3014},
           {id:3014002003,country_id:2003,project_id:3014,text:"Hong Kong",start_date:"31-12-2016",end_date:"31-01-2018",isAlreadyLive:"false",parent:3014},
           {id:3014002004,country_id:2004,project_id:3014,text:"United Kingdom",start_date:"31-01-2019",end_date:"30-06-2020",isAlreadyLive:"false",parent:3014},
           {id:3014002005,country_id:2005,project_id:3014,text:"France",start_date:"30-06-2020",end_date:"30-06-2021",isAlreadyLive:"false",parent:3014},
           {id:3014002006,country_id:2006,project_id:3014,text:"Spain",start_date:"30-06-2020",end_date:"31-01-2021",isAlreadyLive:"false",parent:3014},
           {id:3014002007,country_id:2007,project_id:3014,text:"Germany",start_date:"30-06-2020",end_date:"30-06-2021",isAlreadyLive:"false",parent:3014},
           {id:3014002008,country_id:2008,project_id:3014,text:"Italy",start_date:"30-06-2019",end_date:"30-06-2020",isAlreadyLive:"false",parent:3014},
           {id:3014002009,country_id:2009,project_id:3014,text:"Japan",start_date:"31-01-2018",end_date:"31-12-2018",isAlreadyLive:"false",parent:3014},
           {id:3014002010,country_id:2010,project_id:3014,text:"Korea",start_date:"31-01-2018",end_date:"31-12-2018",isAlreadyLive:"false",parent:3014},

           {id:3015,project_id:3015,text:"NE Variation Order",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:3015002000,country_id:2000,project_id:3015,text:"North America",start_date:"01-10-2018",end_date:"30-06-2019",isAlreadyLive:"false",parent:3015},

           {id:3016,project_id:3016,text:"NE Survey",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:3016002000,country_id:2000,project_id:3016,text:"North America",start_date:"01-10-2018",end_date:"30-06-2019",isAlreadyLive:"false",parent:3016},
           
           {id:3017,project_id:3017,text:"NE Integrated",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:3017002000,country_id:2000,project_id:3017,text:"North America",start_date:"01-10-2018",end_date:"31-12-2018",isAlreadyLive:"false",parent:3017},
           
           {id:3018,project_id:3018,text:"NE Learning",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:3018002005,country_id:2005,project_id:3018,text:"France",start_date:"01-04-2018",end_date:"30-09-2018",isAlreadyLive:"false",parent:3018},
           {id:3018002006,country_id:2006,project_id:3018,text:"Spain",start_date:"01-04-2018",end_date:"30-09-2018",isAlreadyLive:"false",parent:3018},
           
           {id:3019,project_id:3019,text:"NE Digital Hub",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:3019002005,country_id:2005,project_id:3019,text:"France",start_date:"01-04-2018",end_date:"30-09-2018",isAlreadyLive:"false",parent:3019},
           {id:3019002006,country_id:2006,project_id:3019,text:"Spain",start_date:"01-04-2018",end_date:"30-09-2018",isAlreadyLive:"false",parent:3019},
           
           {id:3020,project_id:3020,text:"NE Integrated AA",start_date:"01-01-2018",end_date:"31-12-2025",open:true},
           {id:3020002005,country_id:2005,project_id:3020,text:"France",start_date:"01-10-2018",end_date:"31-12-2018",isAlreadyLive:"false",parent:3020},
           {id:3020002006,country_id:2006,project_id:3020,text:"Spain",start_date:"01-10-2018",end_date:"31-12-2018",isAlreadyLive:"false",parent:3020}
           ]
     };

 
 var jdeProjectId ; var gssProjectId ;
 for(var i in project_consolidation_view.data){
 	var task = project_consolidation_view.data[i];
 	if(task.text == "JDE"){
 		jdeProjectId = task.project_id;
 	}else if(task.text == "GSS"){
 		gssProjectId = task.project_id;
 	}
 }

 
 tasks = project_consolidation_view;
 
 
 gantt.init("gantt_here");
 gantt.parse(tasks); 
 