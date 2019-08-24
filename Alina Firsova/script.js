
var identificator = 0;

function Task(id, done, name, deadline, tag){
    this.id = id;
    this. done = done;
    this.name = name;
    this.deadline = deadline;
    this.tag = tag;
}

function deleteAll(){
    document.getElementById("taskList").innerHTML='';
    localStorage.clear();
}

function init(){
    for (element in localStorage) {
        element = localStorage.getItem(element);
        element = JSON.parse(element);
        if (!(element==null)){
            addTaskDiv(element);
            if (identificator<element.id){
                identificator=Number(element.id);
            }
        }
    }
}

function checkDate(){
    today = new Date();
    todayDate = ([today.getFullYear(), ('0'+(today.getMonth()+1)), today.getDate()]).join('-');
    if ((document.getElementById("deadline").value)<todayDate){
         document.getElementById("deadline").value = todayDate;
         alert("OOPS! Yout task is out of date!")
     }
}

function addTask() {
    identificator=identificator+1;
    taskName=document.getElementById("taskName").value;
    taskTag=document.querySelector('input[name=radioTag]:checked').value;
    taskDeadline=document.querySelector('input[type="date"]').value;
    newTask = new Task(identificator, false, taskName, taskDeadline, taskTag);
    addTaskDiv(newTask);
    var serialnewTask = JSON.stringify(newTask); 
    try {
        localStorage.setItem(identificator, serialnewTask); 
    } 
    catch {
        alert('OOPS! :( Remove one of your old tasks, please');
    } 
}

function addTaskDiv(task){
    taskInfo = document.createElement('task');
    checked = doneCheck(task);
    taskInfo.innerHTML= `
    <div class="taskCheck"><input type="checkbox" class="checkbox" id=${task.id} onclick="isDone(this)" ${checked}/>
    <label for=${task.id}>  <div class="name">${task.name}</div></label></div>
        <div class="deadLine">${task.deadline}</div>
                <div class="taskTag ${task.tag}"> </div><button onclick="delTask(this)" id="${task.id}" class="delete">X</button>`
    document.getElementById("taskList").appendChild(taskInfo);
    changeColor(task);
}

function delTask(element) {
    localStorage.removeItem(element.id)
    element.parentNode.remove();
}

function doneSort(){
    tasks=[];
    document.getElementById("taskList").innerHTML='';
    for (element in localStorage) {
         element = localStorage.getItem(element);
        if (!(element==null)){
        element = JSON.parse(element);
        tasks.push(element);
        }
    }
    tasks.sort(function(a, b){
        var doneA=a.done, doneB=b.done;
        return doneA-doneB 
        })
    tasks.forEach(element => {
       addTaskDiv(element);
    });

}

function doneCheck(task){
    if (!(task==null)){
        if (task.done==true){
            return 'checked'
        }
        else {
            return ''
        }
    }
}

function dateSort(){
    tasks=[];
    document.getElementById("taskList").innerHTML='';
    for (element in localStorage) {
         element = localStorage.getItem(element);
        if (!(element==null)){
        element = JSON.parse(element);
        tasks.push(element);
        }
    }
    tasks.sort(function(a, b){
        var dateA=new Date(a.deadline), dateB=new Date(b.deadline)
        return dateA-dateB 
    })
    tasks.forEach(element => {
       addTaskDiv(element);
    });
}

function isDone(element){
    doneId = element.id;
    task = JSON.parse(localStorage.getItem(doneId));
    task.done = !(task.done); 
    changeColor(task);
    task = JSON.stringify(task); 
    localStorage.setItem(doneId, task); 
}

function changeColor(task){
    element = document.getElementById(task.id);
    if (task.done == true){
        element.parentNode.style.color='gray';
    }
    else{
        element.parentNode.style.color='black';
    }
}

