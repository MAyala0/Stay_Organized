let express = require('express');
let bodyParser = require('body-parser');
//const url = require('url');
//const querystring = require('querystring');

let fs = require("fs");
let app = express();

// Create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false })

function logOneToDo(item) {
    console.log("ID: " + item.id +
        " User ID:" + item.userid +
        " Category:" + item.category +
        " Description:" + item.description +
        " Deadline:" + item.deadline +
        " Priority:" + item.priority +
        " Completed:" + item.completed);
}

function logArrayOfToDos(arr) {
    for (let i = 0; i < arr.length; i++) {
        logOneToDo(arr[i])
    }
}

function logOneUser(item) {
    console.log("ID: " + item.id +
        " Name:" + item.name +
        " Username:" + item.username);
}

function logArrayOfUsers(arr) {
    for (let i = 0; i < arr.length; i++) {
        logOneUser(arr[i])
    }
}

function findMatchingUser(users, username) {
    let match = {
        id: -1,
        name: "n/a",
        username: "n/a"
    };

    for (let i = 0; i < users.length; i++) {
        if (users[i].username.toLowerCase() == username.toLowerCase()) {
            match = {
                id: users[i].id,
                name: users[i].name,
                username: users[i].username
            }
            break;
        }
    }

    return match;
}

//match todo
function getMatchingTodoById(id, items) {
    let match = null;

    for (let i = 0; i < items.length; i++) {
        if (items[i].id == id) {

            return items[i];

        }
    }

    return match;
}


///////////////////////////////////////////////////////////////////////
//   PAGES 

app.get('/index.html', function (req, res) {
    res.sendFile(__dirname + "/public/" + "index.html");
})

app.get('/all_todos.html', function (req, res) {
    res.sendFile(__dirname + "/public/" + "all_todos.html");
})

app.get('/todo_details.html', function (req, res) {
    res.sendFile(__dirname + "/public/" + "todo_details.html");
})

app.get('/new_todo.html', function (req, res) {
    res.sendFile(__dirname + "/public/" + "new_todo.html");
})

app.get('/new_user.html', function (req, res) {
    res.sendFile(__dirname + "/public/" + "new_user.html");
})

app.get('/complete.html', function (req, res) {
    res.sendFile(__dirname + "/public/" + "complete.html");
})

///////////////////////////////////////////////////////////////////////
//   API CALLS 

app.get('/api/todos', function (req, res) {
    console.log("Got a GET request for todos");
    let data = fs.readFileSync(__dirname + "/data/" + "todos.json", 'utf8');
    data = JSON.parse(data);
    console.log("Returned data is: ");
    logArrayOfToDos(data);
    res.end(JSON.stringify(data));
});

app.get('/api/todos/:id', function (req, res) {
    let id = req.params.id;
    console.log("Got a GET request for todo " + id);
    let data = fs.readFileSync(__dirname + "/data/" + "todos.json", 'utf8');
    data = JSON.parse(data);
    console.log("In callback after read");
    let match = data[id - 1];
    console.log("Returned data is: ");
    logOneToDo(match);
    res.end(JSON.stringify(match));
})

app.get('/api/todos/byuser/:id', function (req, res) {
    let id = req.params.id;
    console.log("Got a GET request for todos for user " + id);
    let data = fs.readFileSync(__dirname + "/data/" + "todos.json", 'utf8');
    data = JSON.parse(data);
    let matching = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i].userid == id)
            matching.push(data[i]);
    }
    console.log("Returned data is: ");
    logArrayOfToDos(matching);
    res.end(JSON.stringify(matching));
})

app.get('/api/categories', function (req, res) {
    console.log("Got a GET request for categories");
    let data = fs.readFileSync(__dirname + "/data/" + "categories.json", 'utf8');
    data = JSON.parse(data);
    console.log("Returned all categories.");
    res.end(JSON.stringify(data));
});

app.get('/api/users', function (req, res) {
    console.log("Got a GET request for users");
    let data = fs.readFileSync(__dirname + "/data/" + "users.json", 'utf8');
    data = JSON.parse(data);

    let usersWithoutPasswords = [];
    for (let i = 0; i < data.length; i++) {
        let aUser = { id: data[i].id, name: data[i].name, username: data[i].username }
        usersWithoutPasswords.push(aUser);
    }

    console.log("Returned all users (without passwords).");
    logArrayOfUsers(usersWithoutPasswords);
    res.end(JSON.stringify(usersWithoutPasswords));
});

app.get('/api/username_available/:username', function (req, res) {
    let username = req.params.username;
    console.log("Checking to see if this username " + username + " is available");
    let data = fs.readFileSync(__dirname + "/data/" + "users.json", 'utf8');
    data = JSON.parse(data);

    let matchingUser = findMatchingUser(data, username);
    let message;
    if (matchingUser.id != -1) {
        message = "NO";
    }
    else {
        message = "YES";
    }
    console.log("Returned message is: ");
    console.log(message);
    res.end(message);
});

app.get('/api/users/:username', function (req, res) {
    let username = req.params.username;
    console.log("Got a GET request for username " + username);
    let data = fs.readFileSync(__dirname + "/data/" + "users.json", 'utf8');
    data = JSON.parse(data);
    let match = findMatchingUser(data, username)
    console.log("Returned data is: ");
    console.log(match);
    res.end(JSON.stringify(match));
});

app.post('/api/todos', urlencodedParser, function (req, res) {
    console.log("Got a POST request for ToDo");
    console.log("BODY -------->" + JSON.stringify(req.body));

    let data = fs.readFileSync(__dirname + "/data/" + "todos.json", 'utf8');
    data = JSON.parse(data);

    console.log("Original data: ");
    logArrayOfToDos(data);

    let item = {
        id: data.length + 1,
        userid: req.body.userid,
        category: req.body.category,
        description: req.body.description,
        deadline: req.body.deadline,
        priority: req.body.priority,
        completed: false
    };
    console.log("New Todo: ");
    logOneToDo(item);

    data[data.length] = item;

    console.log("New data after add: ");
    logArrayOfToDos(data);

    fs.writeFileSync(__dirname + "/data/" + "todos.json", JSON.stringify(data));

    console.log('New ToDo saved!');
    res.status(200).send();
})

app.post('/api/users', urlencodedParser, function (req, res) {
    console.log("Got a POST request for users");
    console.log("BODY -------->" + JSON.stringify(req.body));

    let data = fs.readFileSync(__dirname + "/data/" + "users.json", 'utf8');
    data = JSON.parse(data);

    console.log("Original data: ");
    logArrayOfUsers(data);

    // check for duplicate username
    let matching = findMatchingUser(data, req.body.username);
    if (matching.id != -1) {
        // username already exists
        console.log('ERROR: username already exists!');
        res.status(403).send();   // forbidden
        return;
    }

    let item = {
        id: data.length + 1,
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    };
    console.log("New user: ");
    logOneUser(item);

    data[data.length] = item;

    console.log("New data after add: ");
    logArrayOfUsers(data);

    fs.writeFileSync(__dirname + "/data/" + "users.json", JSON.stringify(data));

    console.log('New user saved!');
    res.status(200).send();
})


app.put("/api/todos", urlencodedParser, function (req, res) {
    console.log("Received a PUT request to edit a to-do");
    console.log("BODY -------->" + JSON.stringify(req.body));

    let data = fs.readFileSync(__dirname + "/data/todos.json", "utf8");
    data = JSON.parse(data);

    // find item
    let match = getMatchingTodoById(req.body.id, data) //write a helper function
    if (match == null) {
        res.status(404).send("Not Found");
        return;
    }

    // update the data
    match.description = req.body.description;
    match.priority = req.body.priority;
    match.deadline = req.body.deadline;



    fs.writeFileSync(__dirname + "/data/todos.json", JSON.stringify(data));

    res.status(200).send();
})


/*

app.delete('/api/todos/:id', function (req, res) {
    let id = req.params.id;
    console.log("Got a DELTE request for todos for item " + id);
    let data = fs.readFileSync(__dirname + "/data/" + "todos.json", 'utf8');
    data = JSON.parse(data);
    let matching = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i].id == id)
            matching.push(data[i]);
    }
    console.log("Returned data is: ");
    logArrayOfToDos(matching);
    res.end(JSON.stringify(matching));
})



*/


app.delete("/api/todos/:id", function (req, res) {

    let id = req.params.id;
    console.log("Received a DELETE request for item " + id);

    let data = fs.readFileSync(__dirname + "/data/todos.json", "utf8");
    data = JSON.parse(data);

    // find the index number of the team in the array
   
    let match = getMatchingTodoById(req.params.id, data) //write a helper function

    // mark the team as inactive     
   
    match.completed = true;
    
    

    // console.log("Team marked as inactive: ");
    // logOneTeam(match);
    fs.writeFileSync(__dirname + "/data/todos.json", JSON.stringify(data));

    res.status(200).send();


    /*
    let id = req.body.id;
    console.log("Received a DELETE request to delete a to-do");
    //console.log("BODY -------->" + JSON.stringify(req.body));

    let data = fs.readFileSync(__dirname + "/data/todos.json", "utf8");
    data = JSON.parse(data);
    // update the data
    let match = getMatchingTodoById(req.body.id, data) //write a helper function
    match.completed = true;
    fs.writeFileSync(__dirname + "/data/todos.json", JSON.stringify(data));
    res.status(200).send();
    */
})

/*
app.put('/api/todos', function (req, res) {
   console.log("Got a PUT request for ToDos");
   res.send('ToDos PUT');
})
 
app.delete('/api/todos', function (req, res) {
   console.log("Got a DELETE request for ToDos");
   res.send('ToDos DELETE');
})
*/

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let server = app.listen(8081, function () {
    let port = server.address().port
    console.log("App listening at port %s", port)
})


