var modelController = (function () {

    var Task = function (id, date, title, description, deadline) {
        this.id = id;
        this.date = date;
        this.title = title;
        this.description = description;
        this.deadline = deadline;
        this.checked = false;
    }

    var allTasks = [];
    var months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

    return {
        // get all tasks from local storage
        getTasks: function () {
            if (!localStorage.getItem('allTasks')) {
                return allTasks = [];
            }
            return allTasks = JSON.parse(localStorage.getItem('allTasks'));
        },

        // create the new task
        createTask: function (title, descr, deadline) {
            var newTask, id, date, deadline;
            // create new id for the new task based on the last task id
            id = (allTasks.length) ? allTasks[allTasks.length - 1].id + 1 : 0;

            // create the task date
            var thisMonth = months[(new Date()).getMonth()];
            var thisDay = (new Date()).getDate();
            date = thisDay + ' ' + thisMonth;
            // create new task instance with the created id
            newTask = new Task(id, date, title, descr, deadline);

            return newTask;
        },

        // add new instance to the data structure
        addTask: function (newTask) {
            allTasks.push(newTask);
            localStorage.setItem('allTasks', JSON.stringify(allTasks));
        },

        // delete task by id
        deleteTask: function (delId) {
            // find the index of deleting task in the data structure
            var idx = allTasks.reduce(function (acc, cur, i) {
                if (cur['id'] === parseInt(delId)) {
                    acc = i;
                };
                return acc;
            }, -1);

            allTasks.splice(idx, 1);
            localStorage.setItem('allTasks', JSON.stringify(allTasks));
        },

        // check task by id
        checkTask: function (checkId) {
            console.log(allTasks);
            // find the index of checking task in the data structure
            var idx = allTasks.reduce(function (acc, cur, i) {
                if (cur['id'] === parseInt(checkId)) {
                    acc = i;
                };
                return acc;
            }, -1);

            allTasks[idx].checked = !allTasks[idx].checked;
            localStorage.setItem('allTasks', JSON.stringify(allTasks));
        },

        // sort by deadline
        sortByDeadline: function (deadline) {
            var sortedArr = allTasks.filter(function (task) {
                return task['deadline'] === deadline;
            });
            return sortedArr;
        },

        // sort by done / undone
        sortByDone: function (done) {
            var sortedArr = allTasks.filter(function (task) {
                return task['checked'] === done;
            });
            return sortedArr;
        },

        testing: function () {
            console.log(allTasks);
        }
    };

})();



var viewController = (function () {

    var DOMselectors = {
        inputHeader: '.new-task__header',
        inputTitle: '.new-task__title',
        inputDescr: '.new-task__description',
        inputDeadline: '.new-task__deadline',
        saveButton: '.save-button',
        deleteButton: 'task-delete',
        checkButton: 'task-check',
        tasksContainer: '.tasks-container',
        sortDayBtn: '.sort-tomorrow',
        sortWeekBtn: '.sort-week',
        sortDoneBtn: '.sort-done',
        sortUndoneBtn: '.sort-undone',
        openFormBtn: '.add-new-task',
        closeFormBtn: '.form-close',
        formContainer: '.new-task'
    }

    return {
        // show the new task on the display
        renderTask: function (taskObj) {
            var html, newHtml, container;

            // create html string with placeholder text
            html = '<section class="task" id="idx-%ID%"><nav class="task__edit">' +
                '<button class="ion-button task-check"><i class="ion-icon ion-md-checkmark">' +
                '</i ></button ><button class="ion-button task-delete"><i class="ion-icon ion-md-close">' +
                '</i ></button ></nav ><div class="task__content"><h6 class="task__title">' +
                '%TITLE%</h6 ><div class="task__description"><span>%DESCRIPTION%</span></div></div>' +
                '<div class="task__meta-info"><span class="task__date">date: %DATE%</span>' +
                '<span class="task__deadline">deadline: %DEADLINE%</span></div></section>';

            // replace the placeholders with new task data
            newHtml = html.replace('%ID%', taskObj.id)
                          .replace('%DATE%', taskObj.date)
                          .replace('%DEADLINE%', taskObj.deadline || 'none')
                          .replace('%TITLE%', taskObj.title)
                          .replace('%DESCRIPTION%', taskObj.description);

            // toggle the highlight class
            if (taskObj.checked) {
                newHtml = newHtml.replace('class="task"', 'class="task task-checked"');
            } else {
                newHtml = newHtml.replace('class="task task-checked"', 'class="task"');
            };

            // insert our html chunk into the DOM
            container = DOMselectors.tasksContainer;
            document.querySelector(container).insertAdjacentHTML('beforeend', newHtml);
        },

        // get checked deadline value
        getDeadline: function () {
            var res = 'none';
            document.querySelectorAll(DOMselectors.inputDeadline).forEach(function (input) {
                if (input.checked) res = input.value;
            });
            return res;
        },

        // return values of the input fields
        getData: function () {
            return {
                title: document.querySelector(DOMselectors.inputTitle).value,
                description: document.querySelector(DOMselectors.inputDescr).value,
                deadline: this.getDeadline()
            };
        },

    	clearFields: function () {
            document.querySelector(DOMselectors.inputTitle).value = '';
            document.querySelector(DOMselectors.inputDescr).value = '';
        },

        // delete task from the DOM by ID
        removeTask: function (remId) {
            var temp = document.getElementById(remId);
            temp.parentElement.removeChild(temp);
        },

        // check task as fulfilled
        checkTask: function (remId) {
            var temp = document.getElementById(remId);
            temp.classList.toggle('task-checked');
        },

        // delete all tasks
        removeAll: function () {
            var container = document.querySelector(DOMselectors.tasksContainer);
            while (container.lastElementChild) {
                container.removeChild(container.lastElementChild);
            }
        },

        openForm: function () {
            document.querySelector(DOMselectors.formContainer).style.display = 'block';
        },

        closeForm: function () {
            document.querySelector(DOMselectors.formContainer).style.display = 'none';
        },

        getSelectors: function () {
            return DOMselectors;
        }
    };

})();



var appController = (function (modelCtrl, viewCtrl) {

    var DOMselectors = viewCtrl.getSelectors();;

    //adding listeners of the app
    var setupListeners = function () {
        document.querySelector(DOMselectors.saveButton).addEventListener('click', ctrlAddTask);
        document.querySelector(DOMselectors.tasksContainer).addEventListener('click', ctrlDeleteTask);
        document.querySelector(DOMselectors.tasksContainer).addEventListener('click', ctrlCheckTask);
        document.querySelector(DOMselectors.sortDoneBtn).addEventListener('click', ctrlSortByDone);
        document.querySelector(DOMselectors.sortUndoneBtn).addEventListener('click', ctrlSortByUndone);
        document.querySelector(DOMselectors.sortDayBtn).addEventListener('click', ctrlSortByDay);
        document.querySelector(DOMselectors.sortWeekBtn).addEventListener('click', ctrlSortByWeek);
        document.querySelector(DOMselectors.openFormBtn).addEventListener('click', ctrlOpenForm);
        document.querySelector(DOMselectors.closeFormBtn).addEventListener('click', ctrlCloseForm);
    };

    var ctrlAddTask = function () {
        var inputData, inputHeader, newTask;
        inputHeader = document.querySelector(DOMselectors.inputHeader);

        // get the input data from UI
        inputData = viewCtrl.getData();

        // check that the input fields are filled
        if(inputData.title !== '' && inputData.description !== '') {
            // add the task item to the data controller
            newTask = modelCtrl.createTask(inputData.title, inputData.description, inputData.deadline);
            modelCtrl.addTask(newTask);

            // add the task item to the UI
            viewCtrl.renderTask(newTask);

            // clear the input fields
            viewCtrl.clearFields();

            // repaint the input header
            inputHeader.innerHTML = 'new task';
        } else {
            inputHeader.innerHTML = 'fill in all fields';
        }

    };

    var ctrlDeleteTask = function (e) {
        var itemId, splitId;
        itemId = e.target.parentNode.parentNode.parentNode.id;
        if (e.target.parentNode.classList.contains(DOMselectors.deleteButton) &&
            itemId) {

            // compute id of deleting item
            splitId = itemId.split('-')[1];

            // delete item from UI based on id
            viewCtrl.removeTask(itemId);

            // delete item from the data storage
            modelCtrl.deleteTask(splitId);
        }
    };

    var ctrlCheckTask = function (e) {
        var itemId, splitId;
        itemId = e.target.parentNode.parentNode.parentNode.id;
        if (e.target.parentNode.classList.contains(DOMselectors.checkButton) &&
            itemId) {

            // compute id of deleting item
            splitId = itemId.split('-')[1];

            // rewrite task to the data storage
            modelCtrl.checkTask(splitId);

            // highlight the task in the UI
            viewCtrl.checkTask(itemId);
        }
    };

    var ctrlSortByDone = function () {
        var doneTasks = modelCtrl.sortByDone(true);
        viewCtrl.removeAll();
        doneTasks.forEach(function (item) {
            viewCtrl.renderTask(item);
        });
    };

    var ctrlSortByUndone = function () {
        var undoneTasks = modelCtrl.sortByDone(false);
        viewCtrl.removeAll();
        undoneTasks.forEach(function (item) {
            viewCtrl.renderTask(item);
        });
    };

    var ctrlSortByDay = function () {
        var dailyTasks = modelCtrl.sortByDeadline('day');
        viewCtrl.removeAll();
        dailyTasks.forEach(function (item) {
            viewCtrl.renderTask(item);
        });
    };

    var ctrlSortByWeek = function () {
        var weeklyTasks = modelCtrl.sortByDeadline('week');
        viewCtrl.removeAll();
        weeklyTasks.forEach(function (item) {
            viewCtrl.renderTask(item);
        });
    };

    // re-render the main page in case of page refreshing
    var repaintMainPage = function () {
        var allTasks = modelCtrl.getTasks();
        allTasks.forEach(function (item) {
            viewCtrl.renderTask(item);
        })
    };

    var ctrlOpenForm = function() {
        viewCtrl.openForm();
    };

    var ctrlCloseForm = function() {
        viewCtrl.closeForm();
    };

    return {
        init: function () {
            console.log('the app has started');
            setupListeners();
            repaintMainPage();
        }
    };

})(modelController, viewController);

appController.init();
