"use strict";

//Паттерн модуль
var module = (function () {

  var allTasks = document.getElementById('allTasks');
  var tomorrow = document.getElementById('tomorrowTasks');
  var week = document.getElementById('weekTasks');
  var tasksToBeCompleted = document.getElementById('tasksToBeCompleted');
  var completed = document.getElementById('completedTasks');
  var addButton = document.getElementById('add');
  var inputTask = document.getElementById('task');
  var inputData = document.getElementById('deadline');
  
  //Создать задачу
  function makeTask(task, deadline) {
    var listItem = document.createElement('li');
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    var tag = document.createElement('tag');
    tag.innerText = task;
    var input = document.createElement('input');
    input.type = 'text';
    var tagData = document.createElement('tag');
    tagData.className = 'data';
    tagData.innerText = deadline;
    var dataInput = document.createElement('input');
    dataInput.type = 'data';
    dataInput.pattern = '([0-9]{4}-[0-9]{2}-[0-9]{2})';
    var clearButton = document.createElement('button');
    clearButton.className = 'clear';
    clearButton.innerHTML = 'Clear';

    listItem.appendChild(checkbox);
    listItem.appendChild(tag);
    listItem.appendChild(tagData);
    listItem.appendChild(input);
    listItem.appendChild(dataInput);
    listItem.appendChild(clearButton);

    return listItem;
  };

  //Рендер страницы после загрузки
  (function() {
    var dataLoad = loadFromLocalStorage();

    for (var i = 0; i < dataLoad.tasksToBeCompleted.length; i++) {
      var listItem = makeTask(
        dataLoad.tasksToBeCompleted[i],
        dataLoad.incompleteDataTasks[i]
      );
      tasksToBeCompleted.appendChild(listItem);
      tieUpTasks(listItem, completeTask);
    }
    for (var i = 0; i < dataLoad.completed.length; i++) {
      listItem = makeTask(
        dataLoad.completed[i],
        dataLoad.completeDataTasks[i]
      );
      listItem.querySelector('input[type=checkbox]').checked = true;
      completed.appendChild(listItem);
      tieUpTasks(listItem, incompleteTask);
    }
  })();
  
  //Добавить задачу
  function addTask() {
    if (inputTask.value) {
      var listItem = makeTask(inputTask.value, inputData.value);
      tasksToBeCompleted.appendChild(listItem);
      tieUpTasks(listItem, completeTask);
      inputTask.value = '';
      inputData.value = '';
    }
    saveInLocalStorage();
  };

  addButton.onclick = addTask;
  
  function hide() {
    var listLi = document.getElementsByTagName('li');
    [].forEach.call(listLi, function(i) {
      i.style.display = 'none';
    });
  };

  function tomorrowTask() {
    hide();
    var now = new Date().setHours(24, 0, 0, 0);
    var listItem = document.querySelectorAll('tag.data');
    for (var i = 0; i < listItem.length; i++) {
      var taskDate = new Date(listItem[i].innerText).setHours(0, 0, 0, 0);
      if (now == taskDate) {
        showTask(i);
      }
    }
  };

  function weekTask() {
    hide();
    var now = new Date();
    var listItem = document.querySelectorAll('tag.data');
    var week = new Date().setDate(now.getDate() + 7);
    for (var i = 0; i < listItem.length; i++) {
      var taskDate = new Date(listItem[i].innerText).setHours(0, 0, 0, 0);
      if (now < taskDate && taskDate <= week) {
        showTask(i);
      }
    }
  };

  week.onclick = weekTask;
  tomorrow.onclick = tomorrowTask;

  function showTask(item) {
    var listLi = document.getElementsByTagName('li');
    if (item) {
      listLi[item].removeAttribute('style');
    } else {
      return function() {
        [].forEach.call(listLi, function(all) {
          all.removeAttribute('style');
        });
      }
    }
  };

  allTasks.onclick = showTask();

  function deleteTask() {
    var listItem = this.parentNode;
    var ui = listItem.parentNode;
    ui.removeChild(listItem);
    saveInLocalStorage();
  };

  function completeTask() {
    var listItem = this.parentNode;
    completed.appendChild(listItem);
    tieUpTasks(listItem, incompleteTask);
    saveInLocalStorage();
  };
  
  function incompleteTask() {
    var listItem = this.parentNode;
    tasksToBeCompleted.appendChild(listItem);
    tieUpTasks(listItem, completeTask);
    saveInLocalStorage();
  };

  function tieUpTasks(listItem, checkboxEvent) {
    var checkbox = listItem.querySelector('input[type=checkbox]');
    var clearButton = listItem.querySelector('button.clear');

    checkbox.onclick = checkboxEvent;
    clearButton.onclick = deleteTask;
  };

  //Сохранить данные в Local Storage
  function saveInLocalStorage() {
    var incompleteTaskArr = [];
    var completeTaskArr = [];
    var incompleteDataTaskArr = [];
    var completeDataTaskArr = [];

    for (var i = 0; i < tasksToBeCompleted.children.length; i++) {
      var items = tasksToBeCompleted.children[i].getElementsByTagName('tag')[0]
        .innerText;
      incompleteTaskArr.push(items);
      var itemsData = tasksToBeCompleted.children[i].getElementsByTagName(
        'tag'
      )[1].innerText;
      incompleteDataTaskArr.push(itemsData);
    }
    for (var i = 0; i < completed.children.length; i++) {
      items = completed.children[i].getElementsByTagName('tag')[0]
        .innerText;
      completeTaskArr.push(items);
      itemsData = completed.children[i].getElementsByTagName('tag')[1]
        .innerText;
      completeDataTaskArr.push(itemsData);
    }
    localStorage.setItem('todo', JSON.stringify({
        tasksToBeCompleted: incompleteTaskArr,
        completed: completeTaskArr,
        incompleteDataTasks: incompleteDataTaskArr,
        completeDataTasks: completeDataTaskArr
      })
    );
  };

  //Загрузить данные из Local Storage
  function loadFromLocalStorage() {
    return JSON.parse(localStorage.getItem('todo'));
  }
})();
