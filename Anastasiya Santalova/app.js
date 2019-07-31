'use strict'

function compareDates (date1, date2) {

  var date2Arr = date2.split("-");
  var year1 = date1.getFullYear();
  var year2 = +date2Arr[0];
  var month1 = date1.getMonth()+1;
  var month2 = +date2Arr[1];
  var day1 = date1.getDate();
  var day2 = +date2Arr[2];
  console.log(day1);
  console.log(day2);
  console.log(month1);
  console.log(month2);
  console.log(year1);
  console.log(year2);

  if (year1 === year2 && month1 === month2 && day1 === day2) {
    console.log("today");
    return "today";
  } else if (year1 > year2 || 
      (year1 === year2 && month1 > month2) || 
      (year1 === year2 && month1 === month2 && day1 > day2)) {
        console.log("failed");
    return "failed";
  } else if (year1 === year2 && month1 === month2 && (day2 - day1)===1) {
    console.log("tomorrow");
    return "tomorrow";
  } 
}

function toLocalStorage (list) {
  localStorage.setItem('myArr', JSON.stringify(list));
}

function delButtonOnclick () {
  var delButton = document.getElementsByClassName('tasks__element_delbutton');

  for (var i=0; i<delButton.length; i++) {
    delButton[i].onclick = function (e) {
      var but = this.getAttribute('id');

      e.preventDefault();
      list.delete(but);
      list.show();
    }
  }
}

var list = (function (){

  var taskList;
  var localTaskList = JSON.parse(localStorage.getItem('myArr'));
  
  if (localTaskList.length == 0) {
    taskList = [{id: 123, check: false, text: "drink cofee", deadline: "2019-07-30"}, 
                {id: 321, check: true, text: "call mom", deadline: "2019-07-29"}];
  } else {
    taskList = localTaskList;
  }

  return {
    create: function (text,deadline) {
      var newTask = {};

      newTask.id = Date.now();
      newTask.check = false;
      newTask.text = text;
      newTask.deadline = deadline;

      return newTask;
    },

    push: function (newTask) {
      console.log(taskList);
      taskList.push(newTask);
      console.log(taskList);
      toLocalStorage(taskList);
      console.log(localTaskList);
      //taskList = localTaskList;
      //console.log(taskList);
    },

    delete: function (id) {
      var ind;

      taskList.forEach(function (curr, i) {
        if (curr.id == id) {
          ind = i;
        }
      });

      taskList.splice(ind, 1);
      toLocalStorage(taskList);
    },

    get: function () {
      return taskList;
    },

    show: function (list = taskList) {
      var parentElem = document.getElementById('tasks');

      // clear task-list
      while (parentElem.firstChild) {
        parentElem.removeChild(parentElem.firstChild);
      }
  
      // show updated task-list
      return list.forEach(function(elem){

        var div = document.createElement('div');
        var checkInput = document.createElement('input');
        var textLabel = document.createElement('label');
        var dateSpan = document.createElement('span');
        var delSpan = document.createElement('span');
        var delButton = document.createElement('button');

        div.className = 'tasks__element';
        checkInput.className = 'tasks__element_checkbox'
        checkInput.type = 'checkbox';
        textLabel.className = 'tasks__element_description';
        dateSpan.className = 'tasks__element_date';
        delSpan.className = 'tasks__element_delete';
        delButton.className = 'tasks__element_delbutton';
        delButton.type = 'button';
        delButton.id = elem.id;

        if (elem.check === false) {
          checkInput.checked = false;
        } else {
          checkInput.checked = true;
        };

        textLabel.innerHTML = elem.text;
        dateSpan.innerHTML = elem.deadline;
        delButton.innerHTML = 'X';

        parentElem.appendChild(div);
        div.appendChild(checkInput);
        div.appendChild(textLabel);
        div.appendChild(dateSpan);
        div.appendChild(delSpan);
        delSpan.appendChild(delButton);

        delButtonOnclick();
      })
    },

    filterCheck: function (check) {
      var filteredTaskList = [];

      if (check==="all") {
        return list.show();
      } else if (check==='do') {
        taskList.forEach(function (curr) {
          if (curr.check === false) {
            filteredTaskList.push(curr);
          }
        });
      } else {
        taskList.forEach(function (curr) {
          if (curr.check) {
            filteredTaskList.push(curr);
          }
        });
      }
      return list.show(filteredTaskList);
    },

    filterDeadline: function (deadline) {
      var filteredTaskList = [];
      var today = new Date();

      switch(deadline) {
        case 'failed':
          taskList.forEach(function (curr) {
            console.log(curr);
            console.log(curr.deadline);
            if (compareDates(today, curr.deadline)==="failed") {
              filteredTaskList.push(curr);
            }
          });
          break;
        case 'today':
            taskList.forEach(function (curr) {
            if (compareDates(today, curr.deadline)==="today") {
              filteredTaskList.push(curr);
            }
          });
          break;
        case 'tomorrow':
            taskList.forEach(function (curr) {
            if (compareDates(today, curr.deadline)==="tomorrow") {
              filteredTaskList.push(curr);
            }
          });
          break;
        case 'week':
            taskList.forEach(function (curr) {
            if (compareDates(today, curr.deadline)==="week") {
              filteredTaskList.push(curr);
            }
          });
          break;
        case 'month':
            taskList.forEach(function (curr) {
            if (compareDates(today, curr.deadline)==="month") {
              filteredTaskList.push(curr);
            }
          });
          break;
        default:
          filteredTaskList = taskList;
      }

      return list.show(filteredTaskList);
    }
  };

})();



//var dd = new Date()
//var todayD = dd.getFullYear()+"-"+(dd.getMonth()+1)+"-"+dd.getDate()

window.onload = function () {

  var addTask = document.getElementById('add-task');
  var addDate = document.getElementById('add-date');
  var addButton = document.getElementById('add-button');
  
  var checkBox = document.getElementsByClassName('tasks__element_checkbox');

  list.show();

  addButton.onclick = function (e) {
    e.preventDefault();
    if (addTask.value && addDate.value) {
      var newTask = list.create(addTask.value, addDate.value);
      
      list.push(newTask);
      list.show();
    }
  };;

  delButtonOnclick();
  


  // for (var i=0; i<checkBox.length; i++) {

  //   checkBox[i].onclick = function (e) {

  //     var checked = this.getAttribute('checked');

  //     console.log(checked);
    
  //     e.preventDefault();
  //     if (!checked) {
  //       console.log('ura');
  //       checked = true;
  //     } else {
  //       checked = false;
  //     }
  //   }
  // }

  
  var filterChecked = document.getElementById('filter_checked');
  var filterDeadline = document.getElementById('filter_deadline');

  console.log(filterDeadline);
  console.log(filterDeadline.value);
  
  filterChecked.onchange = function (e) {
    e.preventDefault();

    list.filterCheck(filterChecked.value);
  }

  filterDeadline.onchange = function (e) {
    e.preventDefault();

    list.filterDeadline(filterDeadline.value);
  }

}