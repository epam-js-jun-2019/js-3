var tasklist=[];

function addTask() {
    var task = document.getElementById("task").value;
    var deadline = document.getElementById("deadline").value;
    if (!task) {
      alert("Oh, no! You forgot to write down the task!");
      return;
    }
    tasklist.push({ task: task, deadline: deadline, done:'0' });
    renderTasks();
    document.getElementById("task").value = "";
    document.getElementById("deadline").value = "1";
    return tasklist;
}

function renderTasks() {
    var table=document.getElementById("start");
    while (table.firstChild) {
        table.removeChild(table.firstChild);
      }
    for (var i=0; i<tasklist.length; i++) {
        var taskitem = tasklist[i]['task'],
        dlitem = tasklist[i]['deadline'];
        var tr = document.createElement("tr");
        table.appendChild(tr);
        var td = document.createElement("td");
        tr.appendChild(td);
        var txt = document.createTextNode(taskitem);
        td.appendChild(txt);
        var td2 = document.createElement("td");
        tr.appendChild(td2);
        var deadl = document.createTextNode(dlitem);
        td2.appendChild(deadl);   
    }
}