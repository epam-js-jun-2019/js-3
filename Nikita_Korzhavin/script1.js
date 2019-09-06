/*----------------setting local storage DB------------------ */

var moduleStorage = function() {
  var storage = JSON.parse(localStorage.getItem('todos'));

  var updateLocalStorage = function(storage) {
    localStorage.setItem('todos', JSON.stringify(storage));
  };
  
  if (!storage) {
    storage = {};
    updateLocalStorage(storage);
  }

  var getStorage = function() {
    return storage;
  };

  var addToStorage = function(name, obj) {
    storage[name] = obj;
    updateLocalStorage(storage);
  };

  var removeFromStorage = function(name) {
    delete storage[name];
    updateLocalStorage(storage);
  };

  
  var setItemInStorage = function(itemName) {
    storage[itemName].progress = !storage[itemName].progress;
    updateLocalStorage(storage);
  };

  return {
    getStorage,
    addToStorage,
    removeFromStorage,
    setItemInStorage,
  };
};

/*---------------------------------- */

var module = function() {
  var Store = moduleStorage();
  var storage = Store.getStorage();

  /* -----------------click handlers ------------------- */

  var deleteTodoFromTable = function(todoName) {
    Store.removeFromStorage(todoName);
    var todoTable = document.getElementById('todo-table');
    var todoItem = document.getElementById(todoName);
    todoTable.removeChild(todoItem);
  };

  var switchProgress = function(todoName) {
    Store.setItemInStorage(todoName);
    redrawButtonProgress(todoName, storage[todoName].progress);
  };

  var constructDate = function(num) {
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + num);
  };

  var filterTodos = function() {
    var form = document.getElementById('filter-table');
    var progressOption =
      form.filterProgress.options[form.filterProgress.options.selectedIndex]
        .value;
    var progressValue =
      progressOption === 'done'
        ? true
        : progressOption === 'not done'
        ? false
        : 'dont filter';

    var filteredByProgress =
      progressOption !== 'false'
        ? Object.keys(storage).reduce(function(acc, todo) {
            if (storage[todo].progress === progressValue) {
              acc[todo] = storage[todo];
            }
            return acc;
          }, {})
        : storage;
    //---------------------------------------------------------
    var deadLineOption =
      form.filterDeadline.options[form.filterDeadline.options.selectedIndex]
        .value;

    var deadLineValue =
      deadLineOption === 'tomorrow'
        ? constructDate(1)
        : deadLineOption === 'week'
        ? constructDate(7)
        : 'dont filter';

    var filteredByDeadLine =
      deadLineOption !== 'false'
        ? Object.keys(filteredByProgress).reduce(function(acc, todo) {
            var date1 = new Date(filteredByProgress[todo].deadLine);
            var date2 = deadLineValue;

            if (
              date1.getDate() === date2.getDate() &&
              date1.getFullYear() === date2.getFullYear() &&
              date1.getMonth() === date2.getMonth()
            ) {
              acc[todo] = filteredByProgress[todo];
            }
            return acc;
          }, {})
        : filteredByProgress;
    redrawToDoTable(filteredByDeadLine);
  };

  var tableClickHandler = function(event) {
    event.preventDefault();
    var target = event.target;

    if (target.id === 'filter-button') {
      filterTodos();
    } else if (target.id === 'add-todo-button') {
      addTodoToTable();
    } else {
      var operationType = target.dataset.name;
      var todoName = target.parentElement.id;
      switch (operationType) {
        case 'switch-progress-button':
          switchProgress(todoName);
          break;
        case 'delete-button':
          deleteTodoFromTable(todoName);
          break;
        default:
          break;
      }
    }
  };

  // ------------------view fuctions-assist click handlers---

  var addTodoToTable = function() {
    var form = document.getElementById('todo-form');
    var dataFromInput = {
      task: form.text.value,
      deadLine: form.date.value,
      progress: false,
    };

    var todoName = Math.random();

    Store.addToStorage(todoName, dataFromInput);
    newTodoToTable(todoName, dataFromInput);
    form.text.value = '';
    form.date.value = '';
  };

  var newTodoToTable = function(todo, node) {
    var todoApp = document.getElementById('todo-table');
    var todoItem = document.createElement('div');
    todoItem.classList.add('todo');
    todoItem.id = todo;
    for (var key in node) {
      todoItem.appendChild(toDoChunkCreator(key, node[key]));
    }
    todoItem.appendChild(drawDeleteTodoButton());
    todoApp.appendChild(todoItem);
  };

  var redrawButtonProgress = function(todoName, info) {
    var todoItem = document.getElementById(todoName);
    var children = todoItem.childNodes;
    for (var i = 0; i < children.length; i++) {
      if (children[i].dataset.name === 'switch-progress-button') {
        children[i].innerHTML = info ? 'done' : 'not done';
      }
    }
  };

  var redrawToDoTable = function(newStorage) {
    var todoApp = document.getElementById('todo-app');
    var oldTodoTable = document.getElementById('todo-table');
    var newTodoTable = addTable(newStorage);
    todoApp.replaceChild(newTodoTable, oldTodoTable);
  };

  /*---------------- filter construction ---------------------- */

  var createFilters = function() {
    var ParentDiv = document.createElement('form');
    ParentDiv.id = 'filter-table';
    var filterProgressLabel = document.createElement('label');
    filterProgressLabel.innerHTML = 'filter by progress: ';

    var filterProgress = document.createElement('select');
    filterProgress.name = 'filterProgress';
    filterProgress.appendChild(new Option('default', false, true));
    filterProgress.appendChild(new Option('done', 'done'));
    filterProgress.appendChild(new Option('not done', 'not done'));
    filterProgressLabel.appendChild(filterProgress);
    ParentDiv.appendChild(filterProgressLabel);

    var filterDeadLineLabel = document.createElement('label');
    filterDeadLineLabel.innerHTML = 'filter by date: ';
    var filterDeadLine = document.createElement('select');
    filterDeadLine.name = 'filterDeadline';
    filterDeadLine.appendChild(new Option('default', false, true));
    filterDeadLine.appendChild(new Option('tomorrow', 'tomorrow'));
    filterDeadLine.appendChild(new Option('week', 'week'));

    filterDeadLineLabel.appendChild(filterDeadLine);
    ParentDiv.appendChild(filterDeadLineLabel);

    var submitButton = document.createElement('button');
    submitButton.id = 'filter-button';
    submitButton.innerHTML = 'filter';
    ParentDiv.appendChild(submitButton);
    return ParentDiv;
  };

  //---------------------add todo form

  var drawForm = function() {
    var form = document.createElement('form');
    form.id = 'todo-form';

    var todoTextLabel = document.createElement('label');
    todoTextLabel.innerHTML = 'add todo: ';

    var todoText = document.createElement('input');
    todoText.placeholder = 'enter your task';
    todoText.type = 'text';
    todoText.name = 'text';

    todoTextLabel.appendChild(todoText);
    form.appendChild(todoTextLabel);

    var todoDeadLineLabel = document.createElement('label');
    todoDeadLineLabel.innerHTML = 'add deadline: ';

    var todoDeadline = document.createElement('input');
    todoDeadline.type = 'date';
    todoDeadline.name = 'date';

    todoDeadLineLabel.appendChild(todoDeadline);
    form.appendChild(todoDeadLineLabel);

    var button = document.createElement('button');
    button.id = 'add-todo-button';
    button.innerHTML = 'submit';
    form.appendChild(button);
    return form;
  };

  //---------------------todo item ------------------------------

  var drawDeleteTodoButton = function() {
    var button = document.createElement('button');
    var text = document.createTextNode('delete');
    button.dataset.name = 'delete-button';
    button.classList.add('todo__delete');
    button.appendChild(text);
    return button;
  };

  var drawButtonProgress = function(info) {
    var button = document.createElement('button');
    var text = document.createTextNode(info ? 'done' : 'not done');
    button.dataset.name = 'switch-progress-button';
    button.classList.add('todo__progress');
    button.appendChild(text);
    return button;
  };

  var drawDeadLineInfo = function(deadLine) {
    var todoChunk = document.createElement('span');
    var text = document.createTextNode(deadLine);
    todoChunk.classList.add('todo__deadline');
    todoChunk.appendChild(text);
    return todoChunk;
  };

  var drawTextNode = function(text) {
    var todoChunk = document.createElement('span');
    var text = document.createTextNode(text);
    todoChunk.classList.add('todo__text');
    todoChunk.appendChild(text);
    return todoChunk;
  };

  var toDoChunkCreator = function(key, content) {
    var chunk;
    switch (key) {
      case 'task':
        chunk = drawTextNode;
        break;
      case 'deadLine':
        chunk = drawDeadLineInfo;
        break;
      case 'progress':
        chunk = drawButtonProgress;
        break;
      case 'deleteButton':
        chunk = drawDeleteTodoButton;
        break;
      default:
        break;
    }

    return chunk(content);
  };

  //----------construct table with todos--------------------------------
  var addTable = function(newStorage) {
    var todoTable = document.createElement('div');
    todoTable.id = 'todo-table';
    for (var todo in newStorage) {
      var node = newStorage[todo];
      var todoItem = document.createElement('div');
      todoItem.classList.add('todo');
      todoItem.id = todo;
      //------------todoApp item chunk------------------------------
      for (var key in node) {
        todoItem.appendChild(toDoChunkCreator(key, node[key]));
      }
      todoItem.appendChild(drawDeleteTodoButton());
      todoTable.appendChild(todoItem);
    }
    return todoTable;
  };

  var drawApp = function() {
    var todoApp = document.getElementById('todo-app');
    todoApp.classList.add('todo-app');
    todoApp.onclick = tableClickHandler;
    todoApp.appendChild(addTable(storage));
    todoApp.appendChild(createFilters());
    todoApp.appendChild(drawForm());
  };

  return {
    drawApp: drawApp,
  };
};

window.onload = function() {
  var module1 = module();

  module1.drawApp();
};
