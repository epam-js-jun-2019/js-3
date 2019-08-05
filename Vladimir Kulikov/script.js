var todo = (function () {

    var run = function () {
        if (!localStorage.getItem('todoList')) localStorage.setItem('todoList', "[]");
        if (!localStorage.getItem('todoListId')) localStorage.setItem('todoListId', 1);
        render();
    }

    var addTask = function (e) {
        e.preventDefault();
        var task = document.querySelector('.add-task-text');
        var deadline = document.querySelector('.add-task-deadline');

        if (validate(task, deadline)) {
            var tasks = getTasks();
            var id = genId();
            tasks.push({ id: id, task: task.value, deadline: deadline.value, completed: false });
            saveTasks(tasks);
            task.value = "";
            applyFilters();
        }
    }

    var removeTask = function () {
        var id = this.dataset.remove;
        var tasks = getTasks();
        var updatedTasks = tasks.filter(function (task) {
            return task.id != id;
        });
        saveTasks(updatedTasks);
        applyFilters();
    }

    var completeTask = function () {
        var id = this.dataset.complete;
        var tasks = getTasks();
        var updatedTasks = tasks.map(function (task) {
            if (task.id === id) task.completed = true;
            return task;
        });
        saveTasks(updatedTasks);
        applyFilters();
    }

    var applyFilters = function () {
        var tasks = getTasks();
        var filters = [filterByStatus, filterByDeadline];

        var filteredTasks = filters.reduce(function (acc, filter) {
            acc = filter(acc);
            return acc;
        }, tasks);

        render(filteredTasks);
    }

    var filterByStatus = function (tasks) {
        var filterParam = document.querySelector('.status-filter').value;
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
        var filterParam = document.querySelector('.deadline-filter').value;

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
        var id = document.createElement('th');
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

        var node = appendAll(tr, [id, text, deadline, controls]);
        return node;
    }

    var render = function (filteredTasks) {
        var parentNode = document.querySelector('.task-list');
        while (parentNode.firstChild) {
            parentNode.removeChild(parentNode.firstChild);
        }
        var tasks = filteredTasks ? filteredTasks : getTasks();

        tasks.forEach(function (task) {
            parentNode.appendChild(createNode(task));
        });

        addEventListeners();
    }

    var addEventListeners = function () {
        var addTaskBtn = document.querySelector('.add-task-btn');
        addTaskBtn.addEventListener('click', addTask);

        var removeTaskBtns = document.querySelectorAll('.remove-task-btn');
        removeTaskBtns.forEach(function (btn) {
            btn.addEventListener('click', removeTask);
        });

        var completeTaskBtns = document.querySelectorAll('.complete-task-btn');
        completeTaskBtns.forEach(function (btn) {
            btn.addEventListener('click', completeTask);
        });

        var filters = document.querySelectorAll('.task-filter');
        filters.forEach(function (filter) {
            filter.addEventListener('change', applyFilters);
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