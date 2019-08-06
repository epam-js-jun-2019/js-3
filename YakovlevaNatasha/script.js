
window.onload = function() {

	showClosingButtons();

	//strike out a task
	var listOfTasks = document.querySelector('ul');
	listOfTasks.addEventListener('click', function(event){

		event.target.classList.toggle("checked");

	});

	//create task
	document.getElementById('add-task__button').onclick = function () {

		var li = document.createElement('li');
		var newTask = document.getElementById('add-task__text').value;
	
		if (!newTask.match(/\S/)) {
			alert("Поле не может быть пустым");

		} else {
			var newNode = document.createTextNode(newTask);
			li.appendChild(newNode);
			document.getElementById("tasks").appendChild(li);
			createClosingButton(li);
		}
		
	}

	//show closing buttons
	function showClosingButtons() {
		var tasks = document.getElementsByTagName('li');
		for (var i=0; i<tasks.length; ++i){

			createClosingButton(tasks[i]);
		
		}
	}

	function createClosingButton(task) {

		var span = document.createElement("span");
		var closeBtn = document.createTextNode("\u00D7");

		span.className = "close";
		span.appendChild(closeBtn);
		task.appendChild(span);

		span.onclick = function () {
			task.style.display = "none";
		}

		
	}

}