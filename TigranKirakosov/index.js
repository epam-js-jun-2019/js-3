var UIController = (function() {
  var strings;
  strings = {
    DOM: {
      taskInput: '.input-text',
      deadlineInput: '#deadline',
      submitBtn: '.submit-btn',
      filterInput: '#filter',
      filterBtn: '.filter-btn',
      uncheckedBtn: 'far fa-circle',
      checkedBtn: 'far fa-check-circle',
      deleteBtn: 'fas fa-backspace',
      taskList: '.collection',
      clearBtn: '.clear-btn'
    },
    utils: {
      noDeadline: 'no deadline',
      undone: 'undone',
      done: 'done',
      keyCode: 13,
      noFilter: 'no filter'
    }
  };

  return {
    getInput: function() {
      return {
        text: document.querySelector(strings.DOM.taskInput).value,
        deadline: document.querySelector(strings.DOM.deadlineInput).value,
        filterValue: document.querySelector(strings.DOM.filterInput).value
      };
    },
    getDOMStrings: function() {
      return strings.DOM;
    },
    getUtilsStrings: function() {
      return strings.utils;
    },
    deleteListItem: function(selectorID) {
      var element;
      element = document.querySelector(`#${selectorID}`);
      element.parentNode.removeChild(element);
    },
    toggleTask: function(icon) {
      if (icon.className === strings.DOM.checkedBtn) {
        icon.className = strings.DOM.uncheckedBtn;
      } else if (icon.className === strings.DOM.uncheckedBtn) {
        icon.className = strings.DOM.checkedBtn;
      }
    },
    renderTasks: function(tasks) {
      var taskList;
      var html = '';
      taskList = document.querySelector(strings.DOM.taskList);

      tasks.forEach(function(task) {
        html += `
        <li class="collection__item" id="item-${task.id}">
          <span class="text">${task.text}</span>
          <div class="icons">
            <i class="${task.iconClass}"></i>
            <i class="fas fa-backspace"></i>
          </div>
          <span class="deadline">Deadline: ${task.deadline}</span>
        </li>
        `;
      });
      taskList.innerHTML = html;
    },
    clearTasks: function() {
      document.querySelector(strings.DOM.taskList).innerHTML = '';
    },
    clearFields: function() {
      document.querySelector(strings.DOM.taskInput).value = '';
      document.querySelector(strings.DOM.deadlineInput).value =
        strings.utils.noDeadline;
      document.querySelector(strings.DOM.taskInput).focus();
    }
  };
})();

var LSController = (function(UICtrl) {
  var tasks, toggleTaskState, DOM, UTILS;
  DOM = UICtrl.getDOMStrings();
  UTILS = UICtrl.getUtilsStrings();
  if (
    localStorage.getItem('tasks') === null ||
    localStorage.getItem('tasks') === '' ||
    localStorage.getItem('tasks') === []
  ) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  toggleTaskState = function() {
    if (this.isDone === UTILS.undone) {
      this.isDone = UTILS.done;
      this.iconClass = DOM.checkedBtn;
    } else if (this.isDone === UTILS.done) {
      this.isDone = UTILS.undone;
      this.iconClass = DOM.uncheckedBtn;
    }
  };

  return {
    getTasksFromLS: function() {
      return tasks;
    },
    addToLS: function(task) {
      tasks.push(task);
      localStorage.setItem('tasks', JSON.stringify(tasks));
    },
    deleteFromLS: function(id) {
      var ids, index;
      ids = tasks.map(function(current) {
        return current.id;
      });
      index = ids.indexOf(id);
      if (index !== -1) {
        tasks.splice(index, 1);
      }
      localStorage.setItem('tasks', JSON.stringify(tasks));
    },
    toggleTask: function(id) {
      var ids, index;
      ids = tasks.map(function(current) {
        return current.id;
      });
      index = ids.indexOf(id);
      if (index !== -1) {
        toggleTaskState.call(tasks[index]);
      }
      localStorage.setItem('tasks', JSON.stringify(tasks));
    },
    clearLS: function() {
      tasks = [];
      localStorage.setItem('tasks', []);
    }
  };
})(UIController);

var storageController = (function(UICtrl, LSCtrl) {
  var Task, tasks, DOM, UTILS;
  DOM = UICtrl.getDOMStrings();
  UTILS = UICtrl.getUtilsStrings();
  tasks = LSCtrl.getTasksFromLS();

  Task = function(id, text, deadline) {
    this.id = id;
    this.text = text;
    this.deadline = deadline;
    this.isDone = UTILS.undone;
    this.iconClass = DOM.uncheckedBtn;
  };

  Task.prototype.toggleState = function() {
    if (this.isDone === UTILS.undone) {
      this.isDone = UTILS.done;
      this.iconClass = DOM.checkedBtn;
    } else if (this.isDone === UTILS.done) {
      this.isDone = UTILS.undone;
      this.iconClass = DOM.uncheckedBtn;
    }
  };

  return {
    getTasks: function() {
      return tasks;
    },
    createTask: function(text, deadline) {
      var newTask, ID;
      if (tasks.length > 0) ID = tasks[tasks.length - 1].id + 1;
      else ID = 0;
      newTask = new Task(ID, text, deadline);
      return newTask;
    },
    updateTasks: function() {
      tasks = LSCtrl.getTasksFromLS();
    }
  };
})(UIController, LSController);

var controller = (function(UICtrl, storageCtrl, LSCtrl) {
  var DOM = UICtrl.getDOMStrings();
  var UTILS = UICtrl.getUtilsStrings();
  var setUpEventListeners = function() {
    document.addEventListener('DOMContentLoaded', ctrlDisplayTasks);
    document
      .querySelector(DOM.submitBtn)
      .addEventListener('click', ctrlAddTask);
    document.addEventListener('keypress', function(event) {
      if (event.keyCode === UTILS.keyCode || event.which === UTILS.keyCode) {
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
    document
      .querySelector(DOM.clearBtn)
      .addEventListener('click', ctrlClearTasks);
  };
  var ctrlDisplayTasks = function() {
    var tasks;
    tasks = LSCtrl.getTasksFromLS();
    UICtrl.renderTasks(tasks);
  };
  var ctrlAddTask = function() {
    var input, newTask;
    event.preventDefault();
    input = UICtrl.getInput();
    if (input.text !== '') {
      newTask = storageCtrl.createTask(input.text, input.deadline, input.state);
      LSCtrl.addToLS(newTask);
      ctrlDisplayTasks();
      UICtrl.clearFields();
    }
  };
  var ctrlDeleteTask = function(event) {
    var itemID;
    if (event.target.className === DOM.deleteBtn) {
      itemID = event.target.parentNode.parentNode.id;
    }
    if (itemID) {
      var itemInfo = getItemInfo(itemID);
      LSCtrl.deleteFromLS(itemInfo.ID);
      UICtrl.deleteListItem(itemID);
    }
  };
  var ctrlToggleTask = function(event) {
    var itemID, icon;
    if (
      event.target.className === DOM.uncheckedBtn ||
      event.target.className === DOM.checkedBtn
    ) {
      itemID = event.target.parentNode.parentNode.id;
      icon = event.target;
    }
    if (itemID) {
      var itemInfo = getItemInfo(itemID);
      LSCtrl.toggleTask(itemInfo.ID);
      UICtrl.toggleTask(icon);
    }
  };
  var getItemInfo = function(stringID) {
    splitID = stringID.split('-');
    type = splitID[0];
    ID = +splitID[1];
    return {
      type: type,
      ID: ID
    };
  };
  var ctrlFilterTasks = function() {
    var tasks, filterValue, filteredTasks;
    tasks = LSCtrl.getTasksFromLS();
    filterValue = document.querySelector(DOM.filterInput).value;
    filteredTasks = tasks.filter(function(task) {
      return task.deadline == filterValue || task.isDone == filterValue;
    });
    if (filterValue === UTILS.noFilter) {
      ctrlDisplayTasks();
    } else {
      UICtrl.renderTasks(filteredTasks);
    }
    event.preventDefault();
  };
  var ctrlClearTasks = function() {
    event.preventDefault();
    LSCtrl.clearLS();
    storageCtrl.updateTasks();
    UICtrl.clearTasks();
    document.querySelector(DOM.filterInput).value = UTILS.noFilter;
  };

  return {
    init: function() {
      setUpEventListeners();
    }
  };
})(UIController, storageController, LSController);

controller.init();
