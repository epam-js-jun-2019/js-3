function toDoItem(id,text,date,isDone) {
    this.id = id;
    this.text = text;
    this.date = date;
    this.isDone = isDone;
}

function toDoList() {
    this.rootHtmlElement = document.getElementsByClassName("toDoItems")[0];
    var jsonList = localStorage.getItem("toDoList");
    if (jsonList) {
        storageList = JSON.parse(jsonList);
        this.sequence = storageList.sequence;
        this.list = storageList.list;
    } else {
        this.sequence = 0;
        this.list = [];
    }
}

toDoList.prototype.renderItem = function(toDoItem) {
    var element = createHtmlToDoItem(toDoItem);
    this.rootHtmlElement.appendChild(element);
}

toDoList.prototype.render = function() {
    for (var i = 0; i < this.list.length; i++) {
        this.renderItem(this.list[i]);
    }
}

toDoList.prototype.nextVal = function() {
    return ++this.sequence;
}

toDoList.prototype.add = function(text, date) {
    var newToDoItem = new toDoItem(this.nextVal(),text, date, false);
    this.list.push(newToDoItem);
    this.renderItem(newToDoItem);
}

toDoList.prototype.remove = function (id) {
    for (var i = 0; i < this.list.length; i++) {
        if (this.list[i].id == id) {
            this.list.splice(i,1);
            this.rootHtmlElement.getElementById("id").remove();
            return;
        }
    }
}

toDoList.prototype.getElement = function (id) {
    for (var i = 0; i < this.list.length; i++) {
        if (this.list[i].id == id) {
            return this.list[i];
        }
    }
}

toDoList.prototype.updateItem = function (id,date,isDone) {
    var item = this.getElement(id);
    item.date = date;
    item.isDone = isDone;
}

var createHtmlToDoItem = function (toDoItem) {
    var checkbox = document.createElement("input")
    checkbox.type = "checkbox";
    checkbox.id = toDoItem.id;
    checkbox.classList.add("toDoItem_isDone");
    checkbox.classList.add("form-check-input");
    checkbox.checked = toDoItem.isDone;

    var label = document.createElement("label");
    label.classList.add("toDoItem_label");
    label.innerHTML =toDoItem.text;

    var button = document.createElement("button")
    button.classList.add("remove");
    button.classList.add("toDoItem_button");
    button.classList.add("btn");
    button.classList.add("btn-dark");
    button.classList.add("float-right");
    button.innerHTML = "Remove";

    var calendar = document.createElement("input")
    calendar.type = "date";
    calendar.value = toDoItem.date;
    calendar.classList.add("toDoItem_calendar");

    var div = document.createElement("div");
    div.classList.add("toDoItem");
    div.classList.add("list-group-item");
    div.classList.add("form-group");
    div.id = toDoItem.id;
    div.appendChild(checkbox);
    div.appendChild(calendar);
    div.appendChild(label);
    div.appendChild(button);
    return div;
}

function init() {
    window.onunload = function() {
        localStorage.setItem("toDoList", JSON.stringify(list));
    };

    document.getElementsByClassName("addNewToDo_button")[0]
    .addEventListener("click",function() {
        var value = this.parentElement.getElementsByClassName("addNewToDo_input")[0].value;
        var date = this.parentElement.getElementsByClassName("addNewToDo_calendar")[0].value;
        list.add(value, date);
        this.parentElement.getElementsByClassName("addNewToDo_input")[0].value = '';
    });

    var toDoItems = document.getElementsByClassName("toDoItems")[0];

    toDoItems.addEventListener("click", function(event) {
        if (event.target.classList.contains("remove")) {
            event.target.parentElement.remove();
            list.remove(event.target.parentElement.id);
        }
     });

    toDoItems.addEventListener("change", function(event) {
            var id = event.target.parentElement.id
            var isDone = event.target.parentElement.getElementsByClassName("toDoItem_isDone")[0].checked;
            var date = event.target.parentElement.getElementsByClassName("toDoItem_calendar")[0].value;
            list.updateItem(id,date,isDone);
    });
    list.render();
}

var list = new toDoList();
init();

