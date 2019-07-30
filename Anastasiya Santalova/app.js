'use strict'

// function compareDates (date1, date2) {

//   var year1 = date1.getFullYear();
//   var year2 = date2.getFullYear();
//   var month1 = date1.getMonth();
//   var month2 = date2.getMonth();
//   var day1 = date1.getDate();
//   var day2 = date2.getDate();

//   if (year1 === year2 && month1 === month2 && day1 === day2) {
//     return "today";
//   } else if (year1 > year2 || 
//       (year1 === year2 && month1 > month2) || 
//       (year1 === year2 && month1 === month2 && day1 > day2)) {
//     return "failed";
//   } else if (year1 === year2 && month1 === month2 && (day2 - day1)===1) {
//     return "tomorrow";
//   } 
// }


var list = (function (){

  var taskList = [{id: 123, check: false, text: "drink cofee", deadline: "2019-07-30"}, 
                  {id: 321, check: true, text: "call mom", deadline: "2019-07-29"}];

  //localStorage.setItem('myArr', JSON.stringify(taskList));

  console.log(localStorage.getItem('myArr'));

  return {
    add: function (text,deadline) {
      var newTask = {};

      newTask.id = Date.now();
      newTask.check = false;
      newTask.text = text;
      newTask.deadline = deadline;

      return newTask;
    },

    push: function (newTask) {
      taskList = JSON.parse(localStorage.getItem('myArr'));
      taskList.push(newTask);
      localStorage.setItem('myArr', JSON.stringify(taskList));
      taskList = JSON.parse(localStorage.getItem('myArr'));
      console.log(localStorage.getItem('myArr'));
    },

    delete: function (id) {
      taskList = JSON.parse(localStorage.getItem('myArr'));
      
      var ind;

      taskList.forEach(function (curr, i) {
        console.log(i);
        if (curr.id === id) {
          ind = i;
        }
      });

      taskList.splice(ind, 1);
      localStorage.setItem('myArr', JSON.stringify(taskList));
      taskList = JSON.parse(localStorage.getItem('myArr'));
      console.log(localStorage.getItem('myArr'));
    },

    get: function () {
      taskList = JSON.parse(localStorage.getItem('myArr'));
      return taskList;
    },

    show: function () {
      taskList = JSON.parse(localStorage.getItem('myArr'));
      var parentElem = document.getElementById('tasks');

      while (parentElem.firstChild) {
        parentElem.removeChild(parentElem.firstChild);
      }
  
      return taskList.forEach(function(elem){

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
      })
    },

    filter: function (status, deadline) {
      var filteredTaskList = [];

      if (status==="all") {
        filteredTaskList = taskList;
      } else {
        taskList.forEach(function (curr) {
          if (curr.status === status) {
            filteredTaskList.push(curr);
          }
        });
      }

      var today = new Date();

      var doubleFilteredTaskList = [];

      switch(deadline) {
        case 'failed':
          filteredTaskList.forEach(function (curr) {
            if (compareDates(today, curr.date)==="failed") {
              filteredTaskList.push(curr);
            }
          });
          break;
        case 'today':
          filteredTaskList.forEach(function (curr) {
            if (compareDates(today, curr.date)==="today") {
              filteredTaskList.push(curr);
            }
          });
          break;
        case 'tomorrow':
          filteredTaskList.forEach(function (curr) {
            if (compareDates(today, curr.date)==="tomorrow") {
              filteredTaskList.push(curr);
            }
          });
          break;
        case 'week':
          filteredTaskList.forEach(function (curr) {
            if (compareDates(today, curr.date)==="week") {
              filteredTaskList.push(curr);
            }
          });
          break;
        case 'month':
          filteredTaskList.forEach(function (curr) {
            if (compareDates(today, curr.date)==="month") {
              filteredTaskList.push(curr);
            }
          });
          break;
        default:
          doubleFilteredTaskList = filteredTaskList;
      }

      return doubleFilteredTaskList;
    }
  };

})();

//var dd = new Date()
//var todayD = dd.getFullYear()+"-"+(dd.getMonth()+1)+"-"+dd.getDate()

window.onload = function () {

  var addTask = document.getElementById('add-task');
  var addDate = document.getElementById('add-date');
  var addButton = document.getElementById('add-button');
  var delButton = document.getElementsByClassName('tasks__element_delbutton');

  var delButton1 = document.getElementById('321');
  console.log(delButton1);
 // console.log(delButton1.id);

  list.show();

  addButton.onclick = function (e) {
    e.preventDefault();
    if (addTask.value && addDate.value) {
      var newTask = list.add(addTask.value, addDate.value);
      
      list.push(newTask);
      list.show();
    }
  };;


  delButton.onclick = function () {
    console.log(delButton.id);
    list.delete(delButton.id);
    list.show();
  }


  
  var filterChecked = document.getElementById('filter_checked');
  var filterDeadline = document.getElementById('filter_deadline');
  
  filterChecked.onchange = function (e) {
    e.preventDefault();
    list.filter(filterChecked.value);
    list.show();
  }

  filterDeadline.onchange = function () {
    list.filter(filterChecked.value, filterDeadline.value);
    list.show();
  }

}