var timesheetText = 'timesheet';
var timesheetTmpData = {'value' : {}};
var PopuUpDivID = "tt_popup_div_id";
var htmlTTClass = "time_tracker_sidebar";

// contains all the functions and contents required for setting the details of the timesheet
var timeSheetDetails = {

  // adds the timesheet details in storage
  addDetails: function(){
    clearDataInView();
    var taskName = document.getElementById('task_done').value;
    var taskDuration = document.getElementById('task_duration').value;
    var today = new Date();
    var date = today.getDate() + '-' + (today.getMonth()+1) + '-' + today.getFullYear();
    if (!taskName || !taskDuration) {
      showDataInView(3,'Error: No value specified');
    }else{
      chrome.storage.local.get('timesheet',function(items){
        timesheetTmpData['value'] = items;
        // if 'timesheet' key in hash not already present
        if(Object.keys(timesheetTmpData['value']).length === 0){
          timesheetTmpData['value'][timesheetText] = {};
        }
        // if no key in timesheet for current day present
        if(timesheetTmpData['value'][timesheetText][date] == undefined){
          timesheetTmpData['value'][timesheetText][date] = [];
        }
        // create hash to be added to date's list, and append it to the array
        var tmpHash = {'taskName': taskName, 'taskDuration': taskDuration};
        timesheetTmpData['value'][timesheetText][date].push(tmpHash)
        chrome.storage.local.set(timesheetTmpData['value']); // saving back the final hash
        showDataInView(3,'Detail added');
      });
    }
  },

  // clears all the timesheet details
  clearDetails: function(){
    clearDataInView();
    chrome.storage.local.remove(timesheetText);
    showDataInView(3,'All previous data cleared');
  },

  // returns all the saved details
  getDetails: function(){
    clearDataInView();
    chrome.storage.local.get(timesheetText,function(items){
      if(items[timesheetText] != undefined){
        for(var date in items[timesheetText]){
          showDataInView(1,date,''); // display date as header
          for(var i=0; i < items[timesheetText][date].length; i++){
            sheetDetail = items[timesheetText][date][i];
            showDataInView(2,sheetDetail['taskName'],sheetDetail['taskDuration']);
          }
        }
      }else{
        showDataInView(3,'No data to display','');
      }
    });
  },
};

// creates html elements and added data to be displayed
function showDataInView(type, content1, content2){
  document.getElementById('view_details_div').setAttribute('class','view_details_div_class');
  var element = document.createElement("div");
  if(type == 1){
    element.setAttribute('class','sheet_date');
    element.innerHTML = content1;
  }else if(type == 2){
    element.setAttribute('class','sheet_detail');
    element.innerHTML = content1 + ': ' + content2;
  }else if(type == 3){
    element.setAttribute('class','sheet_detail');
    element.innerHTML = content1;
  }
  document.getElementById('view_details_div').appendChild(element);
}

// clear all data displayed in details div
function clearDataInView(){
 var element = document.getElementById('view_details_div');
 element.innerHTML = '';
 element.setAttribute('class','');
}

function toggleSidebar(){
  if($("html").hasClass(htmlTTClass)){
    $("html").removeClass(htmlTTClass);
    $('#'+PopuUpDivID).addClass('hidden');
  }else{
    $("html").addClass(htmlTTClass);
    $('#'+PopuUpDivID).removeClass('hidden');
  }
}

function setup_view(){
  var div_contents = $("<div id='" + PopuUpDivID + "' class='hidden'><div id='view_details_div'></div><div class='details_options'>\
      <span class='task_span'>Task:</span> <input type='text' name='task' id='task_done' /><br />\
      <span class='duration_span'>Duration:</span> <input type='text' name='taskDur' id='task_duration' />\
    </div>\
    <div class='buttons'>\
      <input type='button' value='Add' id='add_details_button' />\
      <input type='button' value='Clear All' id='clear_all_button' />\
      <input type='button' value='View All Data' id='get_all_details' />\
    </div></div>");
  var toggler = $('<div class="tt_toggle">&#9776;</div>');
  $('body').append(div_contents).append(toggler);
}

$(document).ready(function() {
    setup_view();
    $('.tt_toggle').on('click',toggleSidebar);
    document.getElementById("add_details_button").onclick = timeSheetDetails.addDetails;
    document.getElementById("clear_all_button").onclick = timeSheetDetails.clearDetails;
    document.getElementById("get_all_details").onclick = timeSheetDetails.getDetails;
    // $('html').addClass('timetracker');  
})