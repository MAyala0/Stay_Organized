"use strict"
$(function () {
    //event handler
    $("#newUserForm").on("submit", onSubmitUser);
    $("#newTodoForm").on("reset", resetForm);
});

// check if username is taken: 
function onSubmitUser() {
    //pull what they entered
    let requestedUsername = $("#username").val();

    //call API
    let message = $.get("api/username_available/" + requestedUsername, function (results) {
        //the data from username_avail is back now, process it here
        message = results;
        //if it maches then move on to checking the pw:
        if (message == "YES") {
            $("#usernameDiv").html("");
            submitIfPWMatches();
        }
        //if it doesn't match give an error
        else if (message == "NO") {
            let string = "<p class='errorText'>This username is taken. Please try another.</p>"
            $("#usernameDiv").append(string);
        }
    });
    //this code runs before the username_avail comes back 
    return false;
}

//check if pws match
function submitIfPWMatches() {
    //if they do - post request
    if ($("#password").val() == $("#passwordConf").val()) {
        $("#passwordDiv").html("");
        postNewUser();
    }
    //if they don't- give an error
    else {
        let string = "<p class='errorText'>Your passwords do not match. Please try again.</p>"
            $("#passwordDiv").append(string);
    }
}

//make post request
function postNewUser() {
    $.post({
        url: "api/users",
        data: {
            "name": $("#name").val(),
            "username": $("#username").val(),
            "password": $("#password").val(),
        }
    })
        //confirmation message
        .done(function () {
            
            $("#confirmationDiv").html("")
            let string = "<h3>You've been registered! <a href='new_todo.html'>Get started</a> on building your list"
            $("#confirmationDiv").append(string);
            $("#newUserForm").html("");
        })
        //erro messages
        .fail(function (xhr, textstatus, errorThrown) {
            if (xhr.status == 403) {
                let string = "<p class='errorText'>This username is taken. Please try another</p>"
                $("#usernameDiv").append(string);
            }
            else {
                let string = "<h3>Something went wrong. Please try again</h3>"
                $("#confirmationDiv").append(string);
            }
        })
}

