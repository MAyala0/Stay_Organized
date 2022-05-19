"use strict"



$(function () {
    //onload- get users & to-do's - make call

  
  
    $("#completeBtn").on("click", sendDelete);
});






function sendDelete(item){
    let id= getID();
    $.ajax({
        url: "api/todos/" +id,
        
        type: "DELETE"
})
    .done(function (result) {
    alert("Item marked Complete!");
})
    .fail(function (xht, statusText, errorThrown) {
        alert("ERROR : " + statusText);
    })

}


function getID() {
    const urlParams = new URLSearchParams(location.search);
    let id = -1;
    if (urlParams.has("id") == true) {
        id = urlParams.get("id");
        return id;
    }
}

