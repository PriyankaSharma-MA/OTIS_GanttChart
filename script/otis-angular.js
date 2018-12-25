var scope;
var cardCurrentState = "no-play";
var cardPlayTimeline ;
var cardIcon = $('.cardTimelineBarPlay');
function cardRunTimeline() {
  if(cardCurrentState == "no-play"){
    cardCurrentState =  "play";
    cardIcon.removeClass('active');
    cardPlayTimeline = setInterval(function () {
      cardMoveToNext();
    }, 1500);
  } else {
    cardCurrentState = "no-play";
    cardIcon.addClass('active');
    clearInterval(cardPlayTimeline);
  }
}

var $cardRange = $("#cardRangeSlider");
var cardRangeValueData = [ "Q1-2018", "Q2-2018", "Q3-2018", "Q4-2018",
    "Q1-2019", "Q2-2019", "Q3-2019", "Q4-2019", "Q1-2020",
    "Q2-2020", "Q3-2020", "Q4-2020", "Q1-2021", "Q2-2021",
    "Q3-2021", "Q4-2021", "Q1-2022", "Q2-2022", "Q3-2022",
    "Q4-2022", "Q1-2023", "Q2-2023", "Q3-2023", "Q4-2023",
    "Q1-2024", "Q2-2024", "Q3-2024", "Q4-2024", "Q1-2025",
    "Q2-2025", "Q3-2025", "Q4-2025" ];
$cardRange.ionRangeSlider({
  values : cardRangeValueData,
  type : "single",
  from : 15,
  grid : true,
  onChange: function (data) {
    onCardRangeSliderChange(data);
  },
});

var cardRangeSlider = $cardRange.data("ionRangeSlider");
function cardMoveToNext() {
  var currentLastVal = $cardRange[0].value;
  var nextLastVal = cardRangeValueData.indexOf(currentLastVal) + 1;
  if (nextLastVal === cardRangeValueData.length) {
    clearInterval(cardPlayTimeline);
    cardIcon.removeClass('active');
  }
  else {
    cardRangeSlider.update({
      from : nextLastVal
    });
    onCardRangeSliderChange({from_value: cardRangeValueData[nextLastVal]});
  }
}

function onCardRangeSliderChange(data) {
  console.log(data.from_value);
  var slideData = data.from_value.split('-'); // "Q1-2019" = [Q1, 2019]
  var selQuarterEndMonth = slideData[0].split('Q')[1];
  selQuarterEndMonth = selQuarterEndMonth * 3;
  scope.$apply(function () {
    scope.buildLayout(parseInt(slideData[1]), parseInt(selQuarterEndMonth));
  });
}

function initCardLayout() {
  clearInterval(cardPlayTimeline);
  cardIcon.removeClass('active');
  var element = angular.element(document.querySelector('div[ng-controller=OtisCtrl]'));
  if (!element.injector())
    angular.bootstrap(element, ['OtisApp', 'ngMaterial']);
  scope = element.scope();
  scope.$apply(function () {
    if(selectedCountryId > 0) { // intiate the layout only if country is selected
      scope.buildLayout();
    } else {
      scope.resetLayout();
    }
  });
}

var otisApp = angular.module('OtisApp', ['ngMaterial']);
otisApp.controller('OtisCtrl', ['$scope', function ($scope) {
  $scope.visibleLayout = false;
  $scope.images = [];
  $scope.selYear = 2021; // default
  $scope.selQuarterEndMonth = 12;
  $scope.years = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
  $scope.quarters = [{name: 'Q1', val: 3}, {name: 'Q2', val: 6}, {name: 'Q3', val: 9}, {name: 'Q4', val: 12}];

/*  var imgProjectMap = [{
      project_id: 12,
      year: 0,
      img: "CustomerPortal.png"
    },
    {
      project_id: 1,
      year: 2018,
      img: "dynamics_2018.jpg"
    },
    {
      project_id: 1,
      year: 2019,
      img: "dynamics_2019.jpg"
    },
    {
      project_id: 1,
      year: 0,
      img: "dynamics.jpg"
    },
    {
      project_id: 0,
      year: 0,
      img: "eLogistics.png"
    },
    {
      project_id: 0,
      year: 0,
      img: "eServices.png"
    },
    {
      project_id: 5,
      year: 0,
      img: "FRS.png"
    },
    {
      project_id: 4,
      year: 0,
      img: "IOT.jpg"
    },
    {
      project_id: 2,
      year: 2018,
      img: "jde_2018.jpg"
    },
    {
      project_id: 2,
      year: 2019,
      img: "jde_2019.jpg"
    },
    {
      project_id: 2,
      year: 2020,
      img: "jde_2020.jpg"
    },
    {
      project_id: 2,
      year: 0,
      img: "jde.jpg"
    },
    {
      project_id: 0,
      year: 0,
      img: "kronos.png"
    },
    {
      project_id: 0,
      year: 0,
      img: "netlogo.png"
    },
    {
      project_id: 0,
      year: 0,
      img: "OTIS.jpg"
    },
    {
      project_id: 0,
      year: 0,
      img: "Role_1.svg"
    },
    {
      project_id: 0,
      year: 0,
      img: "Server_1.png"
    },
    {
      project_id: 10,
      year: 0,
      img: "SpareParts.png"
    },
    {
      project_id: 0,
      year: 0,
      img: "Sql-Server.png"
    },
    {
      project_id: 14,
      year: 0,
      img: "SupplierPortal.gif"
    },
    {
      project_id: 11,
      year: 0,
      img: "TKit.png"
    },
    {
      project_id: 9,
      year: 0,
      img: "windchil.jpg"
    },
    {
      project_id: 7,
      year: 0,
      img: "workday.jpg"
    },
    {
      project_id: 15,
      year: 0,
      img: "xClass.png"
    }
  ];*/
  
  var imgProjectMap = [{
      project_id: 3010,
      year: 0,
      img: "CustomerPortal.png"
    },
    {
      project_id: 3000,
      year: 2018,
      img: "dynamics_2018.jpg"
    },
    {
      project_id: 3000,
      year: 2019,
      img: "dynamics_2019.jpg"
    },
    {
      project_id: 3000,
      year: 0,
      img: "dynamics.jpg"
    },
    {
      project_id: 3002,
      year: 0,
      img: "eLogistics.png"
    },
    {
      project_id: 3004,
      year: 0,
      img: "eServices.png"
    },
    {
      project_id: 3014,
      year: 0,
      img: "FRS.png"
    },
    {
      project_id: 3003,
      year: 0,
      img: "IOT.jpg"
    },
    {
      project_id: 3001,
      year: 2018,
      img: "jde_2018.jpg"
    },
    {
      project_id: 3001,
      year: 2019,
      img: "jde_2019.jpg"
    },
    {
      project_id: 3001,
      year: 2020,
      img: "jde_2020.jpg"
    },
    {
      project_id: 3001,
      year: 0,
      img: "jde.jpg"
    },
    {
      project_id: 3006,
      year: 0,
      img: "kronos.png"
    },
    {
      project_id: 0,
      year: 0,
      img: "netlogo.png"
    },
    {
      project_id: 3011,
      year: 0,
      img: "OTIS.jpg"
    },
    {
      project_id: 0,
      year: 0,
      img: "Role_1.svg"
    },
    {
      project_id: 0,
      year: 0,
      img: "Server_1.png"
    },
    {
      project_id: 3008,
      year: 0,
      img: "SpareParts.png"
    },
    {
      project_id: 0,
      year: 0,
      img: "Sql-Server.png"
    },
    {
      project_id: 3013,
      year: 0,
      img: "SupplierPortal.gif"
    },
    {
      project_id: 3009,
      year: 0,
      img: "TKit.png"
    },
    {
      project_id: 3007,
      year: 0,
      img: "windchil.jpg"
    },
    {
      project_id: 3005,
      year: 0,
      img: "workday.jpg"
    },
    {
      project_id: 3012,
      year: 0,
      img: "xClass.png"
    }
  ];
  $scope.buildLayout = function (selYear = 2019, selQuarterEndMonth = 4) {
    document.getElementById("gantt_here").style.height = '40%';
    $scope.visibleLayout = true;
    $('#cardTimelineBar').show();
    $scope.images = []; //reset
    // selYear = !selYear ? new Date().getFullYear() : selYear;
    // selQuarterEndMonth = !selQuarterEndMonth ? new Date().getMonth() + 1 : selQuarterEndMonth;
    var isJde = false;
    var isDynamics = false;
    angular.forEach(program_consolidation_view.data, function (task, index) {
       var task = program_consolidation_view.data[i];
      alert(task)
      if (task.country_id == selectedCountryId && task.parent) {
        var projectEndDate = typeof(task.end_date) == 'string' ? new Date( task.end_date.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") ): task.end_date;
        var projectYear = projectEndDate.getFullYear();
        var projectMonth = projectEndDate.getMonth() + 1;
        var cutDate = moment(new Date(projectYear, projectMonth) ).toDate();
        console.log(task); console.log(cutDate + "-" + new Date(projectYear, projectMonth) 
         + "-" + new Date(selYear, selQuarterEndMonth)); 
        if (cutDate <= moment(new Date(selYear, selQuarterEndMonth) ).toDate() 
        	|| task.isAlreadyLive == "true") {
          var imgObj = imgProjectMap.filter(function(elm){
            return elm.project_id == task.project_id && elm.year === 0;
          });
          if(imgObj && imgObj.length) {
            $scope.images.push(imgObj[0].img);
            if(imgObj[0].img.toLowerCase().indexOf('jde') > -1) {
              isJde = true;
            }
            if(imgObj[0].img.toLowerCase().indexOf('dynamics') > -1) {
              isDynamics = true;
            }
          }
        }
      }
    });
    // special request to show legacy images for JDE & Dynamics if not present
    if (!isJde) {
      $scope.images.push('jde_legacy_erp.png');
    }
    if (!isDynamics) {
      $scope.images.push('dynamics_legacy_crm.png');
    }
  }

  $scope.resetLayout = function() {
    $scope.selYear = 2021;
    $scope.selQuarterEndMonth = 12;
    $scope.visibleLayout = false;
    $('#cardTimelineBar').hide();
    document.getElementById("gantt_here").style.height = '90%';
  }
}]);
