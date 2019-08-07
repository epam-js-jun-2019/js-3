var todo = (function () {

    var DOMSelectors = {
        addTaskInput: '.add-task-text',
        addTaskDeadlineInput: '.add-task-deadline',
        statusFilterSelect: '.status-filter',
        deadlineFilterSelect: '.deadline-filter',
        tasksListTbody: '.task-list',
        addTaskBtn: '.add-task-btn',
        removeTaskBtns: '.remove-task-btn',
        completeTaskBtns: '.complete-task-btn',
        filters: '.task-filter'
    };

    var run = function () {
        if (!localStorage.getItem('todoList')) localStorage.setItem('todoList', "[]");
        if (!localStorage.getItem('todoListId')) localStorage.setItem('todoListId', 1);
        render();
    }

    var addTask = function (e) {
        e.preventDefault();
        var task = document.querySelector(DOMSelectors.addTaskInput);
        var deadline = document.querySelector(DOMSelectors.addTaskDeadlineInput);

        if (validate(task, deadline)) {
            var tasks = getTasks();
            var id = genId();
            tasks.push({ id: id, task: task.value, deadline: deadline.value, completed: false });
            saveTasks(tasks);
            task.value = "";
            deadline.value = "";
            render();
        }
    }

    var removeTask = function () {
        var id = this.dataset.remove;
        var tasks = getTasks();
        var updatedTasks = tasks.filter(function (task) {
            return task.id != id;
        });
        saveTasks(updatedTasks);
        render();
    }

    var completeTask = function () {
        var id = this.dataset.complete;
        var tasks = getTasks();
        var updatedTasks = tasks.map(function (task) {
            if (task.id === id) task.completed = true;
            return task;
        });
        saveTasks(updatedTasks);
        render();
    }

    var getFilteredTasks = function () {
        var tasks = getTasks();
        var filters = [filterByStatus, filterByDeadline];

        var filteredTasks = filters.reduce(function (acc, filter) {
            acc = filter(acc);
            return acc;
        }, tasks);

        return filteredTasks;
    }

    var filterByStatus = function (tasks) {
        var filterParam = document.querySelector(DOMSelectors.statusFilterSelect).value;
        switch (filterParam) {
            case 'completed':
                completedTasks = tasks.filter(function (task) { return task.completed == true });
                return completedTasks;
            case 'incomplete':
                incompleteTasks = tasks.filter(function (task) { return task.completed == false });
                return incompleteTasks;
            default:
                return tasks;
        }
    }

    var filterByDeadline = function (tasks) {
        var filterParam = document.querySelector(DOMSelectors.deadlineFilterSelect).value;

        if (filterParam == 'until-tomorrow') {
            var afterTomorrow = new Date(new Date().setDate(new Date().getDate() + 2));
            var untilTomorrowTasks = tasks.filter(function (task) {
                deadline = new Date(Date.parse(task.deadline));
                if (afterTomorrow.getDate() > deadline.getDate() && deadline.getDate() >= new Date().getDate()) {
                    return task;
                }
            });
            return untilTomorrowTasks;
        }
        if (filterParam == 'in-a-week') {
            var nextWeek = new Date(new Date().setDate(new Date().getDate() + 8));
            var weekTasks = tasks.filter(function (task) {
                deadline = new Date(Date.parse(task.deadline));
                if (nextWeek.getDate() > deadline.getDate() && deadline.getDate() >= new Date().getDate()) {
                    return task;
                }
            });
            return weekTasks;
        }
        return tasks;
    }

    var validate = function () {
        return true;
    }

    var appendAll = function (parent, childs) {
        childs.forEach(function (elem) {
            parent.appendChild(elem);
        });
        return parent;
    };

    var createNode = function (task) {
        var tr = document.createElement('tr');
        tr.setAttribute('data-id', task.id);
        var text = document.createElement('td');
        text.textContent = task.task;
        var deadline = document.createElement('td');
        deadline.textContent = task.deadline || "-";
        var controls = document.createElement('td');

        var removeBtn = document.createElement('button');
        removeBtn.classList.add('btn', 'btn-outline-danger', 'remove-task-btn');
        removeBtn.setAttribute('type', 'button');
        removeBtn.setAttribute('data-remove', task.id);
        removeBtn.textContent = 'Remove';

        if (task.completed) {
            tr.classList.add('table-success');
            var controls = appendAll(controls, [removeBtn]);
        } else {
            var completeBtn = document.createElement('button');
            completeBtn.classList.add('btn', 'btn-outline-primary', 'complete-task-btn');
            completeBtn.setAttribute('type', 'button');
            completeBtn.setAttribute('data-complete', task.id);
            completeBtn.textContent = 'Mark as complete';
            var controls = appendAll(controls, [completeBtn, removeBtn]);
        }

        var node = appendAll(tr, [text, deadline, controls]);
        return node;
    }

    var render = function (filteredTasks) {
        var parentNode = document.querySelector(DOMSelectors.tasksListTbody);
        while (parentNode.firstChild) {
            parentNode.removeChild(parentNode.firstChild);
        }
        var tasks = getFilteredTasks();

        tasks.forEach(function (task) {
            parentNode.appendChild(createNode(task));
        });

        addEventListeners();
    }

    var addEventListeners = function () {
        var addTaskBtn = document.querySelector(DOMSelectors.addTaskBtn);
        addTaskBtn.addEventListener('click', addTask);

        var removeTaskBtns = document.querySelectorAll(DOMSelectors.removeTaskBtns);
        removeTaskBtns.forEach(function (btn) {
            btn.addEventListener('click', removeTask);
        });

        var completeTaskBtns = document.querySelectorAll(DOMSelectors.completeTaskBtns);
        completeTaskBtns.forEach(function (btn) {
            btn.addEventListener('click', completeTask);
        });

        var filters = document.querySelectorAll(DOMSelectors.filters);
        filters.forEach(function (filter) {
            filter.addEventListener('change', render);
        });
    }

    var getTasks = function () {
        return JSON.parse(localStorage.todoList);
    }

    var saveTasks = function (tasks) {
        localStorage.todoList = JSON.stringify(tasks);
    }

    var genId = function () {
        var id = localStorage.todoListId;
        localStorage.todoListId = +localStorage.todoListId + 1;
        return id;
    }

    return { run: run };
})();

todo.run();