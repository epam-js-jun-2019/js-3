var data = [];

function render(filter) {
  var itemList = document.getElementById("itemList");
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  data.forEach(function(el, idx) {
    if (filter == "done") {
      if (el.check) {
        createElement(el, idx);
      }
    }
    if (filter == "undone") {
      if (!el.check) {
        createElement(el, idx);
      }
    }
    if (filter == "all") {
      createElement(el, idx);
    }
    if (filter == 'tmr' || filter == 'week'){
        var now = new Date();
        var dlDate = Date.parse(el.deadLine)
        var delta = dlDate - +now;
        var dayTimeDelta = 86400000;
        var weekTimeDelta = 604800000;
        if (filter == 'tmr' && delta <= dayTimeDelta){
          createElement(el,idx);
        }
        if (filter == 'week' && delta <= weekTimeDelta){
          createElement(el,idx);
        }
    }
    
  });
}

function addItem() {
  var text = document.getElementById("input").value;
  var deadLine = document.getElementById("deadline").value;
  if (!text) {
    alert("You need to write something!");
    return;
  }
  data.push({ text: text, check: false, deadLine: deadLine });
  document.getElementById("input").value = "";
  document.getElementById("deadline").value = "";
  render("all");
}

function createElement(el, idx) {
  var text = el.text;
  var divForItem = document.createElement("div");
  if (el.check) {
    divForItem.className = "item checked";
  } else {
    divForItem.className = "item";
  }
  var pNode = document.createElement("p");
  var textNode = document.createTextNode(text);
  pNode.appendChild(textNode);
  divForItem.appendChild(pNode);

  if (el.deadLine){
    var dl = document.createElement("p");
    dl.className = "ml-2"
    var dlToNode = document.createTextNode(el.deadLine)
    dl.appendChild(dlToNode)
    divForItem.appendChild(dl);
  }

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.appendChild(txt);
  span.className = "close";
  divForItem.appendChild(span);
  
  span.addEventListener("click", function(e) {
    e.stopPropagation();
    itemList.removeChild(divForItem);
    data.splice(idx, 1);
  });

  divForItem.addEventListener("click", function() {
    for (var idx in data) {
      if (data[idx].text == text) {
        if (data[idx].check) {
          data[idx].check = false;
        } else {
          data[idx].check = true;
        }
      }
    }
    divForItem.classList.toggle("checked");
  });

  itemList.appendChild(divForItem);
}
