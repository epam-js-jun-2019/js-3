/* ----------------------toDoObject--------------------- */
/*
function ToDoObj(data) {
  this
}*/

/*----------------setting local storage DB------------------ */

function updateLocalStorage(storage) {
  localStorage.setItem('todos', JSON.stringify(storage));
}

/*---------------------------------- */

var module = function() {
  // тут проверка на то, есть ли список объектов в локал сторэдж
  localStorage.clear();
  var TODO_ITEMS_CLASSES = { task: 'todo__text', progress: 'progress-switch' };
  var storage = JSON.parse(localStorage.getItem('todos'));
  if (!storage) {
    storage = {};
    updateLocalStorage(storage);
  }

  var addToStorage = function(name, obj) {
    storage[name] = obj;
    updateLocalStorage(storage);
  };

  var removeFromStorage = function(name) {
    delete storage[name];
    updateLocalStorage(storage);
  };

  var drawToDoTable = function() {
    //---------todoApp---------------------------------
    var todoApp = document.getElementById('todo-app');
    todoApp.classList.add('todo-app');
    todoApp.onclick = tableClickHandler;
    //----------todoApp item--------------------------------
    for (var key in storage) {
      var node = storage[key];
      var todoItem = document.createElement('div');
      todoItem.classList.add('todo');
      todoItem.dataset.name = key;
      //------------todoApp item chunk------------------------------
      for (var key in node) {
        var todoChunk = document.createElement('span');
        todoChunk.classList.add('todo__chunk', TODO_ITEMS_CLASSES[key]);
        var text = document.createTextNode(node[key]);
        todoChunk.appendChild(text);
        todoItem.appendChild(todoChunk);
      }
      todoApp.appendChild(todoItem);
    }
  };

  var tableClickHandler = function(event) {
    var target = event.target;
    if (target.id === 'todo-app') console.log('todo');
  };

  return {
    addToStorage: addToStorage,
    removeFromStorage: removeFromStorage,
    drawToDoTable: drawToDoTable,
  };
};

window.onload = function() {
  var module1 = module();
  module1.addToStorage('todo1', { task: 'wash the dishes', progress: true });
  module1.addToStorage('todo2', { task: 'clean carpet', progress: false });
  module1.addToStorage('todo3', { task: 'eat lunch ', progress: false });
  module1.addToStorage('todo4', { task: 'do homework', progress: true });

  module1.drawToDoTable();
};
