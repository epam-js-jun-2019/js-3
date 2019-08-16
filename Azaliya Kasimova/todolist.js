function TodoList() {
  this.tasks = [];
}

TodoList.prototype.constructor = TodoList;

TodoList.prototype.addTask = function(value) {
  var task = new TodoTask(value);
  this.tasks.push(task);
}

TodoList.prototype.removeTask = function(number) {
  this.tasks.splice(number, 1);
}

TodoList.prototype.generateHTML = function() {
  var filter = document.getElementById('doneFilter').value;
  var taskMassive;
  if (filter == 'done') {
    taskMassive = this.tasks.filter(function(taskObj) {
      return taskObj.done == true;
    });
  }
  else if (filter == 'notdone') {
    taskMassive = this.tasks.filter(function(taskObj) {
      return taskObj.done == false;
    });
  }
  else {
    taskMassive = this.tasks;
  }
  
  var a = '';
  for (i = 0; i < taskMassive.length; i++) {
    if (taskMassive[i].done) {
      a = a + "<div>" + taskMassive[i].name + "<input type='checkbox' class='markDone' taskid='" + i
    + "' checked><input type='button' value='remove' class='removeButtons' id='" + i +"'></div>";
    }
    else {
      a = a + "<div>" + taskMassive[i].name + "<input type='checkbox' class='markDone' taskid='" + i
    + "'><input type='button' value='remove' class='removeButtons' id='" + i +"'></div>";
    }
  }
  return a;
}

function TodoTask(name) {
  this.name = name;
  this.done = false;
}

TodoTask.prototype.constructor = TodoTask;

var list = new TodoList();

function refreshHTML() {
  var container = document.getElementById('addTaskText');
  container.innerHTML = list.generateHTML();
  var buttons = document.getElementsByClassName('removeButtons');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', onClickRemoveButton);
  }
  var checkBoxes = document.getElementsByClassName('markDone');
  for (var i = 0; i < checkBoxes.length; i++) {
    checkBoxes[i].addEventListener('click', onClickCheckbox);
  }
}

function onClickAddButton() {
  var text = document.getElementById('textOfTask').value;
  document.getElementById('textOfTask').value = '';
  list.addTask(text);
  refreshHTML();
}

document.getElementById('addButton').addEventListener('click', onClickAddButton);

function onClickRemoveButton(eventObject) {
  list.removeTask(eventObject.target.id);
  refreshHTML();
}

function onClickCheckbox(eventObj) {
  var number = eventObj.target.getAttribute('taskid');
  list.tasks[number].done = true;
}

document.getElementById('doneFilterButton').addEventListener('click', applyDoneFilter);

function applyDoneFilter() {
  refreshHTML();
}




 
    









