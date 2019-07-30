
var data = JSON.parse(localStorage.getItem("data")) || [];
render("all");

function validate(date) {
  date = date.split("-");
  if (date.length !== 3 ||
      date[0].length !== 4 ||
      date[1].length !== 2 ||
      date[2].length !== 2 ||
      isNaN(parseInt(date[0])) ||
      isNaN(parseInt(date[1])) || 
      isNaN(parseInt(date[2])) ) {
    return false;
  }
  return true;
}
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
    if (filter == "tmr" || filter == "week") {
      var now = new Date();
      var dlDate = Date.parse(el.deadLine);
      var delta = dlDate - +now;
      var dayTimeDelta = 86400000;
      var weekTimeDelta = 604800000;
      if (filter == "tmr" && delta <= dayTimeDelta) {
        createElement(el, idx);
      }
      if (filter == "week" && delta <= weekTimeDelta) {
        createElement(el, idx);
      }
    }
  });
}

function addItem() {
  var text = document.getElementById("input").value;
  var deadLine = document.getElementById("deadline").value;
  if (!validate(deadLine)){
    alert("You should write data in YYYY-MM-DD format")
    return
  }
  if (!text) {
    alert("You need to write something!");
    return;
  }
  data.push({ text: text, check: false, deadLine: deadLine });
  localStorage.setItem("data", JSON.stringify(data));
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

  if (el.deadLine) {
    var dl = document.createElement("p");
    dl.className = "ml-2";
    var dlToNode = document.createTextNode(el.deadLine);
    dl.appendChild(dlToNode);
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
    localStorage.setItem("data", JSON.stringify(data));
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
    localStorage.setItem("data", JSON.stringify(data));
    divForItem.classList.toggle("checked");
  });

  itemList.appendChild(divForItem);
}

