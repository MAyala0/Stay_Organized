"use strict";


$(function () {

    $.getJSON("api/todos/" + getID(), function (results) {
       let item = results;
       displayInfo(item);
    });
    $("#updateBtn").on("click", putToDo);
});


function displayInfo(matchingItem) {
    $("#categoryDdl").val(matchingItem.category);
    $("#description").val(matchingItem.description);
    $("#deadline").val(matchingItem.deadline);
    $("input[name='priority']:checked").val(matchingItem.priority);
}

function getID() {
    const urlParams = new URLSearchParams(location.search);
    let id = -1;
    if (urlParams.has("id") == true) {
        id = urlParams.get("id");
        return id;
    }
}


// on submit - put request from info that was entered. 
function putToDo() {
    
    $.ajax({
        url: "api/todos",
        data: {
            id:  getID(),
            description: $("#description").val(),
            deadline: $("#deadline").val(),
            priority: $("input[name='priority']:checked").val()
        },
        type: "PUT"
    })
        .done(function (result) {
            alert("Item updated!");
        })
        .fail(function (xht, statusText, errorThrown) {
            $("msgDib").html("ERROR : " + statusText);
        })
}


