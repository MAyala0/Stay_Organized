"use strict";
let users = [];
let categories = [];

$(function () {
    //make call for users and categories:
    $.getJSON("api/users", function (results) {
        users = results;
        loadUsers();
    });
    $.getJSON("api/categories", function (results) {
        categories = results;
        loadCategories();
    });
    //event handlers:
    $("#newTodoForm").on("submit", checkSelections);

    $("#newTodoForm").on("reset", resetForm);
});

//add users to DDL
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
        $("#userDdl").append(newOption)
    }
}

//add categories to DDL
function loadCategories() {
    //sort:
    categories.sort(function (a, b) {
        return a.name.localeCompare(b.name);
    });
    //loop
    let length = categories.length
    for (let i = 0; i < length; i++) {
        //append each as an option
        let newOption = $("<option value='" + categories[i].id + "'>" + categories[i].name + "</option>")
        $("#categoryDdl").append(newOption)
    }
}

//check to make sure they chose from the DDL
function checkSelections() {
    if ($("#userDdl option:selected").val() == "-1") {
        let string = "<p class='errorText'>Please select a User</p>"
        $("#userDiv").append(string)
    }
    else if ($("#userDdl option:selected").val() != "-1") {
        $("#userDiv").html("")
    }
    if ($("#categoryDdl option:selected").val() == "-1") {
        let string = "<p class='errorText'>Please select a category</p>"
        $("#categoryDiv").append(string)
    }
    else if ($("#categoryDdl option:selected").val() != "-1") {
        $("#categoryDiv").html("")
    }
    if ($("#categoryDdl option:selected").val() != "-1" && $("#userDdl option:selected").val() != "-1") {
        $("#categoryDiv").html("")
        $("#userDiv").html("")
        postNewTask()
    }
    return false;
}


//make post request
function postNewTask() {
    $.post({
        url: "api/todos",
        data: {
            "userid": $("#userDdl").val(),
            "category": $("#categoryDdl option:selected").text(),
            "description": $("#description").val(),
            "deadline": $("#deadline").val(),
            "priority": $("input[name='priority']:checked").val(),
        }
    })
        //confirmation message
        .done(function () {
            $("#confirmationDiv").html("")
            let string = "<h3>This task has been added to " + $("#userDdl option:selected").text() + "'s <a href='all_todos.html'>To-Do List</a>!"
            $("#confirmationDiv").append(string);
            $("#newTodoForm").html("");
        })
        .fail(function () {
            let string = "<h3>Something went wrong. Please try again</h3>"
            $("#confirmationDiv").append(string);
        })
}

function resetForm() {
    $("#categoryDiv").html("")
    $("#userDiv").html("")
    $("#confirmationDiv").html("")
}



