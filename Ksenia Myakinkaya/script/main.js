var list = [];

function Point(name, deadline){
    this.name=name;
    this.done=false;
    if (deadline!=undefined && deadline!=''){
        this.deadline=new Date(deadline);
    }
    else this.deadline=null;
}

Point.prototype.do = function(){
    this.done=true;
    ShowList();
}

Point.prototype.isExpired = function(){
    var today=new Date();
    if(this.deadline!=null && this.deadline-today<=-1000*60*60*24 && this.done===false){
        this.done=null;
    }
}

function AddElement(){
    for (let i=0;i<arguments.length;i++){
        list.push(arguments[i]);
    }
    ShowList();
}

function DeleteElement(point){
    for (let i=0; i<list.length; i++){
        if ((point===list[i])){
            list.splice(i,1)
        }
    }
    ShowList();
}

function FilterDone(done){
    ClearView();
    for (let i=0; i<list.length; i++){
        if(list[i].done===done){
            CreateTaskView(list[i]);
        }
    }
}

function FilterTommorow(){
    ClearView();
    var today=new Date();
    for (let i=0; i<list.length; i++){
        if(list[i].deadline!=null && list[i].deadline-today<=1000*60*60*24 && list[i].done!=null){
            CreateTaskView(list[i]);
        }
    }
}

function FilterWeak(){
    ClearView();
    var newList=[];
    var today=new Date();
    for (let i=0; i<list.length; i++){
        if(list[i].deadline!=null && list[i].deadline-today<=1000*60*60*24*7 && list[i].done!=null){
            CreateTaskView(list[i]);
        }
    }
}


function CreateTaskView(point){
        var main=document.querySelector(".main");
        var task=document.createElement("section");
        task.classList.add("main__task");
        main.appendChild(task);
        var task_name=document.createElement("section");
        var task_deadline=document.createElement("section");
        var task_status=document.createElement("section");
        var task_delete=document.createElement("section");
        task_name.append(point.name);
        task_name.classList.add("main__def");
        task_deadline.append(GetDate(point.deadline)||"");
        task_deadline.classList.add("main__def")
        task_status.classList.add("main__status");
        if (point.done){
            task_name.classList.add("main__def_done")
            task_deadline.classList.add("main__def_done")
            task_status.classList.add("main__status_done")
        }
        else {
            point.isExpired();
            if (point.done===null){
                task_deadline.classList.add("main__def_expired")
            }
        }
        task_status.addEventListener('click', function() {point.do()})
        task_delete.append("Delete task");
        task_delete.classList.add("main__def");
        task_delete.setAttribute("id","delete");
        task_delete.addEventListener('click', function() {DeleteElement(point)});
        task.appendChild(task_name);
        task.appendChild(task_deadline);
        task.appendChild(task_status);
        task.appendChild(task_delete);
}

function ClearView(){
    var main = document.querySelector(".main");
    while (main.firstChild) {
        main.removeChild(main.firstChild);
    }
}



function GetDate(date){
    if (date===null) return null;
    else return date.toDateString();
}

function CreateAddTaskMenu(){
    var parent = document.querySelector(".add-new");
    parent.removeChild(parent.firstChild);
    parent.classList.add("add-new_clicked");
    parent.append("Введи новую задачу:");
    var task_name=document.createElement("input");
    task_name.setAttribute("type", "text");
    parent.appendChild(task_name);
    parent.append('Установи дедлайн:');
    var task_deadline=document.createElement("input");
    task_deadline.setAttribute("type", "date");
    parent.appendChild(task_deadline);
    var add_button= document.createElement("button");
    add_button.append("Добавить в список")
    add_button.addEventListener("click",function(){
        var MyPoint= new Point(task_name.value, task_deadline.value);
        AddElement(MyPoint);
        task_name.value='';
        task_deadline.valueAsDate=new Date();
    });
    parent.appendChild(add_button);
}


function ShowList(){
    ClearView();
    for (let i=0; i<list.length; i++){
        CreateTaskView(list[i]);
    }
    var filter=document.getElementById("filter");
    filter.value="all";
}

ShowList();

(function(){
    var add_button=document.getElementById("add");
    add_button.addEventListener('click',function(){CreateAddTaskMenu()});
    var filter=document.getElementById("filter");
    filter.addEventListener('change',function(){
        switch (filter.value){
        case "all":
            ShowList();
            break;
        case "true":
            FilterDone(true);
            break;
        case "false":
            FilterDone(false);
            break;
        case "expired":
            FilterDone(null);
            break;
        case "tomorrow":
            FilterTommorow();
            break;
        case "weak":
            FilterWeak();
            break;
    }
    })
}());
