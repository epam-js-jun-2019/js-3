var tasklist=[];

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
    renderTasks();
    document.getElementById("task").value = "";
    document.getElementById("deadline").value = "1";
    console.log(tasklist);
    return tasklist;
}

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


function renderTasks() {
    var table=document.getElementById("start");
    while (table.firstChild) {
        table.removeChild(table.firstChild);
      }
    for (var i=0; i<tasklist.length; i++) {
        var taskitem = tasklist[i]['task'],
        dlitem = getDLdate(tasklist[i]['deadline'],tasklist[i]['creationDate']);
        status = tasklist[i]['done'];

        var tr = document.createElement("tr");
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
        tr.appendChild(td_Status);
        var statusitem = document.createTextNode(status);
        td_Status.appendChild(statusitem); 

        var td_Actions = document.createElement("td");
        tr.appendChild(td_Actions);
        var actionitems = document.createElement("a");
        actionitems.setAttribute("href", "#");
        actionitems.setAttribute("class", "delete");
        actionitems.setAttribute("id", i);
        actionitems.setAttribute("onclick",'deleteTask('+i+')');
        var del = document.createTextNode("❌");
        actionitems.appendChild(del);
        td_Actions.appendChild(actionitems); 


    }
};

function deleteTask(taskID){
    tasklist.splice(taskID,1);
    renderTasks();
}

