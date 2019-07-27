
document.getElementById("inputBtn").addEventListener("click", function(e) {
  e.preventDefault();
});

function addItem() {
  var text = document.getElementById("input").value;
  if (!text) {
    alert("You need to write something!");
    return
  }

  var divForItem = document.createElement("div");
  divForItem.className= 'item';
  var pNode = document.createElement("p");
  var textNode = document.createTextNode(text);
  pNode.appendChild(textNode);
  divForItem.appendChild(pNode);

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.appendChild(txt);
  span.className = "close";
  divForItem.appendChild(span)
  document.getElementById("input").value = "";
  span.addEventListener('click',function(e){
      e.stopPropagation()
      divForItem.style.display = 'none'
  })


  divForItem.addEventListener('click',function(){
        divForItem.classList.toggle('checked');
  })
  var itemList = document.getElementById("itemList");
  itemList.appendChild(divForItem);
}
