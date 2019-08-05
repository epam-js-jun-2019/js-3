var tasklist=JSON.parse(localStorage.getItem("tasklist")) || [];
var filterCase = {status: null, deadline: null};

function addTask() {
    var task = document.getElementById("task").value;
    var deadline = document.getElementById("deadline").value;
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!task) {
      alert("Oh, no! You forgot to write down the task!");
      return;
    }
    tasklist.push({ task: task, deadline: deadline, done:'0', creationDate: today});
    localStorage.setItem("tasklist", JSON.stringify(tasklist));

    render();
    document.getElementById("task").value = "";
    document.getElementById("deadline").value = "1";
    console.log(tasklist);
};

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function getDLdate(param, creationDate) {
    var DLDate;
    this.creationDate=creationDate;
    switch(param) {
        case '1':
            DLDate = 'Not set';
            break;
        case '2':
            cDate = addDays(creationDate, 1);
            DLDate = cDate.toLocaleDateString();
            break;
        case '3':
            cDate = addDays(creationDate, 7);
            DLDate = cDate.toLocaleDateString();
            break;       
    }
    return DLDate;
}

function render () {
    var table=document.getElementById("start");
    while (table.firstChild) {
        table.removeChild(table.firstChild);}
    for (var i=0; i<tasklist.length; i++) {
        renderfilter_status(i);
    }
};

function renderTasks(i) {
    var table=document.getElementById("start"),
        taskitem = tasklist[i]['task'],
        dlitem = getDLdate(tasklist[i]['deadline'],tasklist[i]['creationDate']),
        status = tasklist[i]['done'],

        tr = document.createElement("tr");
    tr.setAttribute("id", i);
    table.appendChild(tr);

    var td_Task = document.createElement("td");
    tr.appendChild(td_Task);
    var txt = document.createTextNode(taskitem);
    td_Task.appendChild(txt);
        
    var td_Deadline = document.createElement("td");
    tr.appendChild(td_Deadline);
    var deadl = document.createTextNode(dlitem);
    td_Deadline.appendChild(deadl); 

    var td_Status = document.createElement("td");
    td_Status.setAttribute("id", "st"+i);

    tr.appendChild(td_Status);
    switch (status){
        case '0': 
            statustext="In Progress...";
            break;
        case '1':
            statustext="Done!";
            break;
    }
            
    var statusitem = document.createTextNode(statustext);
    td_Status.appendChild(statusitem); 

    var td_Actions = document.createElement("td");
    tr.appendChild(td_Actions);

    var action_Delete = document.createElement("span");
    action_Delete.setAttribute("id", "d"+i);
    var del = document.createTextNode(" ❌ ");
    action_Delete.appendChild(del);
    td_Actions.appendChild(action_Delete); 
        
    document.getElementById("d"+i)
    .addEventListener("click", function() {
        tasklist.splice(i,1);
        document.getElementById(i).remove();
        console.log("Task #"+i+" removed");
        console.log(tasklist);
        
        localStorage.setItem("tasklist", JSON.stringify(tasklist));
    });
        
    var action_Status = document.createElement("span");
    action_Status.setAttribute("id", "s"+i);
    if (tasklist[i]) {
        switch (tasklist[i].done){
            case '0':
                var fin = document.createTextNode(" ✅ ")
                action_Status.appendChild(fin);
                break;
            case '1':
                var fin = document.createTextNode(" ❎ ")                
                action_Status.appendChild(fin);
                break;
            default:
                break;
        }
    }
    td_Actions.appendChild(action_Status); 
    document.getElementById("s"+i)
    .addEventListener("click", function(){
        switch (tasklist[i].done){
            case '0': 
                tasklist[i].done = "1";
                document.getElementById("s"+i).innerHTML=" ❎ ";
                document.getElementById("st"+i).innerHTML="Done!";
                break;
            case '1':
                tasklist[i].done = "0";
                document.getElementById("s"+i).innerHTML=" ✅ ";
                document.getElementById("st"+i).innerHTML="In Progress...";
                break;
        }
        localStorage.setItem("tasklist", JSON.stringify(tasklist));
        console.log(i);
    });
};

(function setfilter () {
    document.getElementById("setstatusfilter")
    .addEventListener("click", function() {
        filterCase.status=document.querySelector('input[name=status_filter]:checked').value
        console.log(filterCase.status);
        render();
    });
    document.getElementById("setdeadlinefilter")
    .addEventListener("click", function() {
        filterCase.deadline=document.querySelector('input[name=deadline_filter]:checked').value
        console.log(filterCase.deadline);
        render();
    });
})();

function renderfilter_deadline(i){
    switch(filterCase.deadline) {
        case 'day':
            if (tasklist[i].deadline == '2') {
                renderTasks(i);
            }
            break;
        case 'week':
            if (tasklist[i].deadline == '3') {
                renderTasks(i);
            }
            break;
        default:
            renderTasks(i);
            break;
    }
}

function renderfilter_status(i) {
    switch(filterCase.status) {
        case 'done':
            if (tasklist[i].done == '1') {
                renderfilter_deadline(i);
            }
            break;
        case 'undone':
            if (tasklist[i].done == '0') {
                renderfilter_deadline(i);
            }
            break;
        default:
                renderfilter_deadline(i);
            break;
        }
}

render();
