var taskController = (function() {
  var Task, tasks;

  Task = function(id, text, deadline) {
    this.id = id;
    this.text = text;
    this.deadline = deadline;
    this.isDone = 'undone';
    this.toggleState = function() {
      this.isDone === 'undone'
        ? (this.isDone = 'done')
        : (this.isDone = 'undone');
    };
  };

  tasks = [];

  return {
    getTasks: function() {
      return tasks;
    },
    addTask: function(text, deadline) {
      var newTask, ID;
      if (tasks.length > 0) ID = tasks[tasks.length - 1].id + 1;
      else ID = 0;

      newTask = new Task(ID, text, deadline);
      tasks.push(newTask);

      return newTask;
    },
    deleteTask: function(id) {
      var ids, index;
      ids = tasks.map(function(current) {
        return current.id;
      });
      index = ids.indexOf(id);
      if (index !== -1) {
        tasks.splice(index, 1);
      }
    },
    toggleTask: function(id) {
      var ids, index;
      ids = tasks.map(function(current) {
        return current.id;
      });
      index = ids.indexOf(id);
      if (index !== -1) {
        tasks[index].toggleState();
      }
    },
    testing: function() {
      console.log(tasks);
    }
  };
})();

var UIController = (function() {
  var DOMStrings;
  DOMStrings = {
    taskInput: '.input-text',
    deadlineInput: '#deadline',
    submitBtn: '.submit-btn',
    filterInput: '#filter',
    filterBtn: '.filter-btn',
    uncheckedBtn: 'far fa-circle',
    checkedBtn: 'far fa-check-circle',
    deleteBtn: 'fas fa-backspace',
    taskList: '.collection'
  };

  return {
    getInput: function() {
      return {
        text: document.querySelector(DOMStrings.taskInput).value,
        deadline: document.querySelector(DOMStrings.deadlineInput).value,
        filterValue: document.querySelector(DOMStrings.filterInput).value
      };
    },
    getDOMStrings: function() {
      return DOMStrings;
    },
    addListItem: function(obj) {
      var html;
      html = `
      <li class="collection__item" id="item-${obj.id}">
        <span class="text">${obj.text}</span>
        <div class="icons">
          <i class="far fa-circle"></i>
          <i class="fas fa-backspace"></i>
        </div>
        <span class="deadline">Deadline: ${obj.deadline}</span>
      </li>
      `;
      document
        .querySelector(DOMStrings.taskList)
        .insertAdjacentHTML('beforeend', html);
    },
    deleteListItem: function(selectorID) {
      var element;
      element = document.querySelector(`#${selectorID}`);
      element.parentNode.removeChild(element);
    },
    toggleTask: function(selectorID) {
      var icon, text;
      icon = document.querySelector(`#${selectorID}`).children[1].children[0];
      text = document.querySelector(`#${selectorID}`).children[0];
      if (icon.className === DOMStrings.checkedBtn) {
        icon.className = DOMStrings.uncheckedBtn;
        text.style.textDecoration = 'none';
      } else if (icon.className === DOMStrings.uncheckedBtn) {
        icon.className = DOMStrings.checkedBtn;
        text.style.textDecoration = 'line-through';
      }
    },
    filterTasks: function(tasks) {
      var filterValue, filteredTasks, html, taskList;
      filterValue = document.querySelector(DOMStrings.filterInput).value;
      taskList = document.querySelector(DOMStrings.taskList);

      filteredTasks = tasks.filter(function(task) {
        return task.deadline == filterValue || task.isDone == filterValue;
      });
      filteredTasks.forEach(function(task) {
        html += `
        <li class="collection__item" id="item-${task.id}">
          <span class="text">${task.text}</span>
          <div class="icons">
            <i class="far fa-circle"></i>
            <i class="fas fa-backspace"></i>
          </div>
          <span class="deadline">Deadline: ${task.deadline}</span>
        </li>
        `;
      });
      taskList.innerHTML = html;
    },
    clearFields: function() {
      document.querySelector(DOMStrings.taskInput).value = '';
      document.querySelector(DOMStrings.deadlineInput).value = 'none';
    }
  };
})();

var storageController = (function() {})();

var controller = (function(tasksCtrl, UICtrl, storageCtrl) {
  var setUpEventListeners = function() {
    var DOM = UICtrl.getDOMStrings();
    document
      .querySelector(DOM.submitBtn)
      .addEventListener('click', ctrlAddTask);
    document.addEventListener('keypress', function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddTask();
        event.preventDefault();
      }
    });
    document
      .querySelector(DOM.taskList)
      .addEventListener('click', ctrlDeleteTask);
    document
      .querySelector(DOM.taskList)
      .addEventListener('click', ctrlToggleTask);
    document
      .querySelector(DOM.filterBtn)
      .addEventListener('click', ctrlFilterTasks);
  };
  var ctrlDisplayTasks = function() {
    var tasks, taskList, html, DOM;
    DOM = UICtrl.getDOMStrings();
    tasks = tasksCtrl.getTasks();
    taskList = document.querySelector(DOM.taskList);
    tasks.forEach(function(task) {
      html += `
      <li class="collection__item" id="item-${task.id}">
        <span class="text">${task.text}</span>
        <div class="icons">
          <i class="far fa-circle"></i>
          <i class="fas fa-backspace"></i>
        </div>
        <span class="deadline">Deadline: ${task.deadline}</span>
      </li>
      `;
    });
    taskList.innerHTML = html;
  };
  var ctrlAddTask = function() {
    var input, newTask;
    input = UICtrl.getInput();
    if (input.text !== '') {
      newTask = tasksCtrl.addTask(input.text, input.deadline, input.state);
      UICtrl.addListItem(newTask);
      UICtrl.clearFields();
    }
    event.preventDefault();
  };
  var ctrlDeleteTask = function(event) {
    var itemID, splitID, ID;
    if (event.target.className === 'fas fa-backspace') {
      itemID = event.target.parentNode.parentNode.id;
    }
    if (itemID) {
      splitID = itemID.split('-');
      type = splitID[0];
      ID = +splitID[1];
      tasksCtrl.deleteTask(ID);
      UICtrl.deleteListItem(itemID);
    }
  };
  var ctrlToggleTask = function(event) {
    var itemID, splitID, ID;
    if (event.target.className === 'far fa-circle' || 'far fa-check-circle') {
      itemID = event.target.parentNode.parentNode.id;
    }
    if (itemID) {
      splitID = itemID.split('-');
      type = splitID[0];
      ID = +splitID[1];
      tasksCtrl.toggleTask(ID);
      UICtrl.toggleTask(itemID);
    }
  };
  var ctrlFilterTasks = function() {
    var tasks, filterValue, DOM;
    DOM = UICtrl.getDOMStrings();
    tasks = tasksCtrl.getTasks();
    filterValue = document.querySelector(DOM.filterInput).value;
    if (filterValue === 'no filter') {
      ctrlDisplayTasks();
    } else {
      UICtrl.filterTasks(tasks);
    }

    event.preventDefault();
  };

  return {
    init: function() {
      console.log('Application started.');
      setUpEventListeners();
    }
  };
})(taskController, UIController, storageController);

controller.init();
