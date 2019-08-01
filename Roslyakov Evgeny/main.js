// add event handler
// get input values
// add the new item to the data structure
// add the new item to the UI
// update the UI

var dataController = (function () {

  var Task = function (id, title, description) {
    this.id = id;
    this.title = title;
    this.description = description;
  }

  var allTasks = [];

  return {
    addTask: function (title, descr) {
      var newTask, id;
      // create new id for the new task based on the last task id
      if(allTasks.length > 0) {
        id = allTasks[allTasks.length - 1].id + 1;
      } else {
        id = 0;
      }
      // create the new task instance with the created id
      newTask = new Task(id, title, descr);
      // add our instance to data structure
      allTasks.push(newTask);

      return newTask;
    },

    testing: function () {
      console.log(allTasks);
    }
  };

})();



var UIController = (function () {

  var DOMselectors = {
    inputTitle: '.add-title',
    inputDescr: '.add-description',
    saveButton: '.save-button',
    tasksContainer: '.tasks-container'
  }

  return {
    // show the new task on the display
    renderTask: function (taskObj, container) {
      var html, newHtml;

      // 1 create html string with placeholder text
      html = '<div class="task" id="idx-%ID%"><h6 class="task-title">%TITLE%</h6>' +
      '<p class="task-description">%DESCRIPTION%</p></div>';

      // 2 replace the placeholders with new task data
      newHtml = html.replace('%ID%', taskObj.id);
      newHtml = newHtml.replace('%TITLE%', taskObj.title);
      newHtml = newHtml.replace('%DESCRIPTION%', taskObj.description);

      // 3 insert our html chunk into the DOM
      container.insertAdjacentHTML('beforeend', newHtml);
    },

    // return values of the input fields
    getData: function () {
      return {
        title: document.querySelector(DOMselectors.inputTitle).value,
        description: document.querySelector(DOMselectors.inputDescr).value
      };
    },

    getSelectors: function () {
      return DOMselectors;
    }
  };

})();



var appController = (function (dataCtrl, UICtrl) {
  var DOMselectors = UICtrl.getSelectors();;

  //adding listeners of the app
  var setupListeners = function () {
    document.querySelector(DOMselectors.saveButton).addEventListener('click', ctrlAddTask);
  };

  var ctrlAddTask = function () {
    var inputData, newTask, tasksContainer;

    // 1 get the input data from UI
    inputData = UICtrl.getData();

    // 2 add the task item to the data controller
    newTask = dataCtrl.addTask(inputData.title, inputData.description);

    // 3 add the task item to the UI
    tasksContainer = document.querySelector(DOMselectors.tasksContainer);
    UICtrl.renderTask(newTask, tasksContainer);
  };

  return {
    init: function () {
      console.log('app has started');
      setupListeners();
    }
  };

})(dataController, UIController);

appController.init();
