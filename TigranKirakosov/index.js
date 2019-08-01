var taskController = (function() {
  var Task, tasks;

  Task = function(id, text, deadline) {
    this.id = id;
    this.text = text;
    this.deadline = deadline;
    this.isDone = false;
    this.toggleState = function() {
      this.isDone = !this.isDone;
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
    filterTasks: function() {},
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
    uncheckedBtn: '.far, .fa-circle',
    checkedBtn: '.far, .fa-check-circle',
    deleteBtn: '.fas, .fa-backspace',
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
        <span class="deadline">Deadline: ${obj.deadline}</span>
        <div class="icons">
          <i class="far fa-circle"></i>
          <i class="fas fa-backspace"></i>
        </div>
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
      .querySelector(DOM.filterBtn)
      .addEventListener('click', ctrlFilterTasks);
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
    itemID = event.target.parentNode.parentNode.id;
    if (itemID) {
      splitID = itemID.split('-');
      type = splitID[0];
      ID = +splitID[1];
      tasksCtrl.deleteTask(ID);
      UICtrl.deleteListItem(itemID);
    }
  };
  var ctrlFilterTasks = function() {};

  return {
    init: function() {
      console.log('Application started.');
      setUpEventListeners();
    }
  };
})(taskController, UIController, storageController);

controller.init();
