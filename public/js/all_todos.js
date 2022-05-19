"use strict"
let users = [];
let items = [];

$(function () {
    //onload- get users & to-do's - make call
    $.getJSON("api/users", function (results) {
        users = results;
        loadUsers();
    });

    $("#usersDdl").on("change", matchItems);
    $("#completedCheck").on("change", matchItems);

});


//loop through and pull users to add to DDL
function loadUsers() {
    //sort:
    users.sort(function (a, b) {
        return a.name.localeCompare(b.name);
    });
    //loop
    let length = users.length
    for (let i = 0; i < length; i++) {
        //append each as an option
        let newOption = $("<option value='" + users[i].id + "'>" + users[i].name + "</option>")
        $("#usersDdl").append(newOption)
    }
}

//loop through all to-do's and match with user
function matchItems() {
    $.getJSON("api/todos/byuser/" + $("#usersDdl").val(), function (results) {
        items = results;

        $("#mainDiv").html("");
        let length = items.length;
        for (let i = 0; i < length; i++) {
            if ($("#completedCheck").prop("checked")) {
                addCards(items[i]);
            }
            else {
                if (items[i].completed==false){
                    addCards(items[i]);
                }
            }
        }
    });
}

//Helper Functions
function createDdl() {
    let string = "<select id='usersDdl' class='form-control'><option value='-1'>Select a User</option></select>"
    $("#mainDiv").append(string);
}

function addCards(item) {

    let string = "<div class='col-sm-3 m-3'><div id='cardDiv" + item.id + "' class='card cardsize'><div class='card-body'><h5 class='card-title'>" + item.description + "</h5><p class='card-text'>Category: " + item.category + "</p><p>Priority: " + item.priority + "</p><p>Deadline: " + item.deadline + "</p>"

    if (item.completed == true) {
        
        $("#mainDiv").append(string);
        $("#cardDiv" + item.id + "").addClass("completedItems")
    }
    else {
        string += "<div class='d-flex justify-content-end' id='btnDiv" + item.id + "'><input type='button' class='btn btn-primary mr-2' onclick='sendDelete(" + item.id + ");'value='Complete'></input><a href='edit_todo.html?id=" + item.id + "' class='btn btn-outline-info mr-2'>Edit</a></div>"
        $("#mainDiv").append(string);
    }
}

function sendDelete(id) {
    $.ajax({
        url: "api/todos/" + id,

        type: "DELETE"
    })
        .done(function (result) {
            //alert("Item marked Complete!");
            clearCompletedTask(id);
        })
        .fail(function (xht, statusText, errorThrown) {
            alert("ERROR : " + statusText);
        })

}

function clearCompletedTask(id) {
    //set checkmark image as background in div?
    $("#cardDiv" + id + "").addClass("completedItems")
    $("#btnDiv" + id + "").remove()
}


