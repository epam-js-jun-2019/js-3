'use strict'

//********************** MAIN FUNCTION **********************

// Self-invoking function to save an array of data in a closure.
// There are 7 methods included:

// * CREATE: creates new task as an object
// * PUSH: adds task into taskList array
// * DELETE: delete task from array
// * SHOW: displays task list on the screen
// * FILTERCHECK: filters tasks by the completed / not completed parameter
// * FILTERDEADLINE: filters tasks by deadline parameter
// * CHANGESTAT: change and save task status (completed / not completed)


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
      taskList.push(newTask);
      toLocalStorage(taskList);
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
        checkInput.id = elem.id + "-1";
        textLabel.className = 'tasks__element_description';
        dateSpan.className = 'tasks__element_date';
        delSpan.className = 'tasks__element_delete';
        delButton.className = 'tasks__element_delbutton';
        delButton.type = 'button';
        delButton.id = elem.id + "-2";

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
        checkboxOnclick();
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

      switch(deadline) {
        case 'failed':
          taskList.forEach(function (curr) {
            if (compareDates(curr.deadline)[0]==="failed" || 
                compareDates(curr.deadline)[1]==="failed") {
              filteredTaskList.push(curr);
            }
          });
          break;
        case 'today':
            taskList.forEach(function (curr) {
              console.log(compareDates(curr.deadline));
            if (compareDates(curr.deadline)[0]==="today" ||
                compareDates(curr.deadline)[1]=== "today") {
              filteredTaskList.push(curr);
            }
          });
          break;
        case 'tomorrow':
            taskList.forEach(function (curr) {
            if (compareDates(curr.deadline)[0]==="tomorrow" || 
                compareDates(curr.deadline)[1]==="tomorrow") {
              filteredTaskList.push(curr);
            }
          });
          break;
        case 'week':
            taskList.forEach(function (curr) {
            if (compareDates(curr.deadline)[0]==="week" || 
                compareDates(curr.deadline)[1]==="week") {
              filteredTaskList.push(curr);
            }
          });
          break;
        case 'month':
            taskList.forEach(function (curr) {
            if (compareDates(curr.deadline)[0]==="month" || 
                compareDates(curr.deadline)[1]==="month") {
              filteredTaskList.push(curr);
            }
          });
          break;
        default:
          filteredTaskList = taskList;
      }

      return list.show(filteredTaskList);
    },

    changestat: function(id) {
      taskList.forEach(function (curr) {
        if (curr.id === id) {
          curr.check = !curr.check;
        }
      });
      toLocalStorage(taskList);
    }
  };

})();


//************** HELPER FUNCTION FOR ADDING TASK LIST TO LOCALSTORAGE **************

function toLocalStorage (list) {
  localStorage.setItem('myArr', JSON.stringify(list));
}


//********************** HELPER FUNCTION FOR LIST.FILTERDEADLINE **********************

function compareDates (deadline) {

  //setting variables for TODAY, TOMORROW and DEADLINE dates
  
  var today = new Date();
  var todayYear = today.getFullYear();
  var todayMonth = today.getMonth();
  var todayDay = today.getDate();
  
  var dl = Date.parse(deadline);
  var deadlineDate = new Date(dl);
  var deadlineYear = deadlineDate.getFullYear(); 
  var deadlineMonth = deadlineDate.getMonth();;
  var deadlineDay = deadlineDate.getDate();

  var tomorrow = new Date();
  tomorrow.setDate(today.getDate()+1);
  var tomorrowYear = tomorrow.getFullYear();
  var tomorrowMonth = tomorrow.getMonth();
  var tomorrowDay = tomorrow.getDate();

  //comparing deadline with current date and adding special attributes into array

  if (todayYear === deadlineYear && todayMonth === deadlineMonth && todayDay === deadlineDay) {
    
    var arr1 = ["today", "month"];
    return arr1;

  } else if (todayYear > deadlineYear || 
      (todayYear === deadlineYear && todayMonth > deadlineMonth) || 
      (todayYear === deadlineYear && todayMonth === deadlineMonth && todayDay > deadlineDay)) {
    
    var arr2 = ["failed"];

    if (todayYear === deadlineYear && todayMonth === deadlineMonth) {
      arr2.push("month");
    }
    return arr2;

  } else if (tomorrowYear === deadlineYear && 
              tomorrowMonth === deadlineMonth && 
              tomorrowDay === deadlineDay) {
    
    var arr3 = ["tomorrow"];
    if (todayMonth === deadlineMonth) {
      arr3.push("month");
    }
    return arr3;

  } else if (todayYear === deadlineYear && todayMonth === deadlineMonth) {

    var arr4 = ["month"];
    return arr4;

  } else {

    var arr5 = [""];
    return arr5;

  }
}



// ***************  ONCLICK FUNCTIONS  ***************


function addButtonOnclick () {

  var addTask = document.getElementById('add-task');
  var addDate = document.getElementById('add-date');
  var addButton = document.getElementById('add-button');

  addButton.onclick = function (e) {
    e.preventDefault();
    if (addTask.value && addDate.value) {
      var newTask = list.create(addTask.value, addDate.value);
      
      list.push(newTask);
      list.show();
    }
  };;

}

function delButtonOnclick () {

  var delButton = document.getElementsByClassName('tasks__element_delbutton');

  for (var i=0; i<delButton.length; i++) {
    delButton[i].onclick = function (e) {
      var but = this.getAttribute('id');
      var butArr = but.split("-");

      e.preventDefault();
      list.delete(butArr[0]);
      list.show();
    }
  }

}

function checkboxOnclick () {

  var checkBox = document.getElementsByClassName('tasks__element_checkbox');

  for (var i=0; i<checkBox.length; i++) {
    checkBox[i].onclick = function (e) {
      var check = this.getAttribute('id');
      var checkArr = check.split("-");

      e.preventDefault();
      list.changestat(+checkArr[0]);
      list.show();
    }
  }

}

function filterCheckedOnchange () {

  var filterChecked = document.getElementById('filter_checked');

  filterChecked.onchange = function (e) {
    e.preventDefault();

    list.filterCheck(filterChecked.value);
  }

}

function filterDeadlineOnchange () {

  var filterDeadline = document.getElementById('filter_deadline');

  filterDeadline.onchange = function (e) {
    e.preventDefault();

    list.filterDeadline(filterDeadline.value);
  }

}



//***************** CALLING UP FUNCTIONS ON LOADING PAGE *****************


window.onload = function () {

  list.show();

  addButtonOnclick();
  delButtonOnclick();
  checkboxOnclick();
  filterCheckedOnchange();
  filterDeadlineOnchange();

}