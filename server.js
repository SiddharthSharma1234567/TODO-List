const express = require("express");
const app = express();
const client = require("mongodb").MongoClient;
app.set("view engine", "ejs");
const cookieparser = require("cookie-parser");
const session = require("express-session");
const { fileLoader } = require("ejs");

app.use(cookieparser());
app.use(session({
    saveUninitialized: true,
    resave: false,
    secret: "dsdv_____$%%",
    cookie: { maxAge: 24 * 60 * 60 * 100 }
}))

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let dbinstance;
client.connect("mongodb+srv://SiddharthSharma:siddharth@cluster0.gacgrpw.mongodb.net/")
    .then((data) => {
        dbinstance = data.db("todolist");
        console.log("Mongodb connected");
    })
    .catch((err) => {
        console.log(err);
    })

// ------------------------------------ Signup data ------------------------------------------------------------

app.post("/signupdata", (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const obj = {};
    const obj2 = {};
    obj.username = username;
    obj.email = email;
    obj.password = password;
    obj2.username = username;
    obj2.email = email;
    obj2.password = password;
    obj2.categories = [];
    obj.tasks = [];
    dbinstance.collection("data").insertOne(obj);
    // .then((result) => {
    //     console.log("data inserted successfully");
    //     res.redirect("/");
    // })
    // .catch((err) => {
    //     console.log(err);
    // })
    dbinstance.collection("categories_data").insertOne(obj2)
        .then((result) => {
            console.log("data inserted successfully");
            res.redirect("/");
        })
        .catch((err) => {
            console.log(err);
        })
})

// ------------------------------------ Login data ------------------------------------------------------------

app.post("/logindata", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    dbinstance.collection("data").findOne({ $and: [{ "email": email }, { "password": password }] })
        .then((result) => {
            if (result == null) {
                res.send("Incorrect email/password");
            }
            else {
                req.session.email = email;
                res.redirect("/");
            }
        })
})

// ------------------------------- Adding Categories --------------------------------------

app.post("/taskcategories", (req, res) => {
    const categories = req.body.categories;
    dbinstance.collection("categories_data").findOne({ "email": "siddharthsharma0722@gmail.com" })
        .then((data) => {
            const realarr = data.categories;
            const myarr = [...realarr];
            myarr.push(categories);
            return dbinstance.collection("categories_data").updateOne({ "email": "siddharthsharma0722@gmail.com" }, { $set: { categories: myarr } });
        })
        .then(()=>{
            res.status(200).send("Category added successfully");
        })
        .catch((err) => {
            res.status(500).send("Error adding category");
        })
})

// ---------------------------------------- Adding Task Data ----------------------------------------------------------------

app.post("/addtaskdata", (req, res) => {
    const { input_task, hidden } = req.body;
    let my_result={};
    dbinstance.collection("data").findOne({ "email": "siddharthsharma0722@gmail.com" })
        .then((result) => {
            const task_array = [...result.tasks];
            const obj = {};
            obj.category = hidden;
            obj.task = input_task;
            obj.isCompleted = false;
            task_array.push(obj);
            return dbinstance.collection("data").updateOne({ "email": "siddharthsharma0722@gmail.com" }, { $set: { "tasks": task_array } })
        })
        .catch((err) => {
            console.log(err);
        })
    
        dbinstance.collection("data").findOne({ "email": "siddharthsharma0722@gmail.com" })
        .then((result)=>{
            my_result={...result};
        })
        .then(()=>{
            res.json(my_result)
        })
        .catch((err)=>{
            console.log(err);
        })
})

// --------------------------------------- Check Iscompleted ---------------------------------------------------------------

app.post("/isCompleted", (req, res) => {
    const { hidden_category, hidden_task } = req.body;
    let my_result={};
    dbinstance.collection("data").findOne({ "email": "siddharthsharma0722@gmail.com" })
        .then((data) => {
            const arr = [...data.tasks];
            arr.map((element) => {
                if (element.category === hidden_category && element.task === hidden_task) {
                    if (element.isCompleted) {
                        element.isCompleted = false;
                    }
                    else {
                        element.isCompleted = true;
                    }
                }
            })
            return dbinstance.collection("data").updateOne({ "email": "siddharthsharma0722@gmail.com" }, { $set: { "tasks": arr } });
        })
        .catch((err) => {
            console.log(err);
        })

        dbinstance.collection("data").findOne({ "email": "siddharthsharma0722@gmail.com" })
        .then((result)=>{
            my_result={...result};
        })
        .then(()=>{
            res.json(my_result)
        })
        .catch((err)=>{
            console.log(err);
        })
})

// ----------------------------------------- delete task---------------------------------------------------------------------

app.post("/deletetask",(req,res)=>{
    const { hidden_category, hidden_task } = req.body;
    dbinstance.collection("data").findOne({ "email": "siddharthsharma0722@gmail.com" })
        .then((data) => {
            const arr=data.tasks.filter((item)=>{
                return (item.category===hidden_category && item.task!==hidden_task);
            })
            return dbinstance.collection("data").updateOne({ "email": "siddharthsharma0722@gmail.com" }, { $set: { "tasks": arr } })
                .then(() => {
                    res.redirect("/" + hidden_category);
                })
                .catch((err) => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        })
})

// ------------------------------------ Endpoints to Render data ------------------------------------------------------------

app.get("/login.html", (req, res) => {
    res.sendFile(__dirname + "/login.html");
})

app.get("/login.css", (req, res) => {
    res.sendFile(__dirname + "/login.css");
})

app.get("/signup.css", (req, res) => {
    res.sendFile(__dirname + "/signup.css");
})

app.get("/background.jpg", (req, res) => {
    res.sendFile(__dirname + "/background.jpg");
})

app.get("/background2.jpg", (req, res) => {
    res.sendFile(__dirname + "/background2.jpg");
})

app.get("/icon.jpg", (req, res) => {
    res.sendFile(__dirname + "/icon.jpg");
})

app.get("/login.js", (req, res) => {
    res.sendFile(__dirname + "/login.js");
})

app.get("/signup.js", (req, res) => {
    res.sendFile(__dirname + "/signup.js");
})

app.get("/signup.html", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

app.get("/home.css", (req, res) => {
    res.sendFile(__dirname + "/home.css");
})

app.get("/home.js", (req, res) => {
    res.sendFile(__dirname + "/home.js");
})

// -------------------------------- Home Endpoints --------------------------------------------

app.get("/:x", (req, res) => {
    let x = req.params.x;
    dbinstance.collection("categories_data").findOne({ "email": "siddharthsharma0722@gmail.com" })
        .then((result) => {
            const category_array = [...result.categories];
            dbinstance.collection("data").findOne({ "email": "siddharthsharma0722@gmail.com" })
                .then((data) => {
                    const filtered_data = data.tasks.filter((task) => { return task.category === x });
                    res.render("home", { "category_array": category_array, "category": x, "filtered_data": filtered_data });
                })
                .catch((err) => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        })
})

app.get("/", (req, res) => {
    // if ("siddharthsharma0722@gmail.com") {
    //     dbinstance.collection("categories_data").findOne({ "email": "siddharthsharma0722@gmail.com" })
    //         .then((result) => {
    //             const category_array = [...result.categories];
    //             res.render("home", { "category_array": category_array, "category": category_array[0] });
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         })
    // }
    // else {
    //     res.redirect("/login.html");
    // }

    dbinstance.collection("categories_data").findOne({ "email": "siddharthsharma0722@gmail.com" })
        .then((result) => {
            const category_array = [...result.categories];
            dbinstance.collection("data").findOne({ "email": "siddharthsharma0722@gmail.com" })
                .then((data) => {
                    const filtered_data = data.tasks.filter((task) => { return task.category === category_array[0] });
                    res.render("home", { "category_array": category_array, "category": category_array[0], "filtered_data": filtered_data });
                })
                .catch((err) => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        })
})

app.listen(3000, (err) => {
    if (err) {
        console.log("Unable to activate server");
    }
    else {
        console.log("Server activated");
    }
})











// ----------------------------------prevous resourse --------------------------------
// app.post("/taskcategories", (req, res) => {
//     const categories = req.body.categories;

//     dbinstance.collection("data").findOne({ "email": "siddharthsharma0722@gmail.com" })
//         .then((data) => {
//             const obj = {};
//             obj.categories = categories;
//             data.tasks.push(obj);
//             dbinstance.collection("data").updateOne({ "email": "siddharthsharma0722@gmail.com" }, { $set: { "tasks": data.tasks } });
//             res.redirect("/");
//         })
// })

// app.post("/isCompleted", (req, res) => {
//     console.log("hello")
//     const hidden = req.body.hidden;
//     const hidden2 = req.body.hidden2
//     console.log(hidden2)
//     console.log("falana")
//     dbinstance.collection("data").findOne({ "email": "siddharthsharma0722@gmail.com" })
//         .then((data) => {
//             data.tasks.map((element) => {
//                 if (element.categories === hidden) {
//                     element.task.map((data) => {
//                         if (data.mission === hidden2) {
//                             if (data.isCompleted) {
//                                 data.isCompleted = false;
//                             }
//                             else {
//                                 data.isCompleted = true;
//                             }
//                         }
//                     })
//                 }
//             })
//             dbinstance.collection("data").updateOne({ "email": "siddharthsharma0722@gmail.com" }, { $set: { "tasks": data.tasks } });
//             res.redirect("/" + hidden);
//         })
//         .catch((err) => {
//             console.log(err);
//         })
// })

// app.post("/addtaskdata", (req, res) => {
//     const { input_task, hidden } = req.body;
//     dbinstance.collection("data").findOne({ "email": "siddharthsharma0722@gmail.com" })
//         .then((data) => {
//             data.tasks.map((element) => {
//                 if (element.categories === hidden) {
//                     const obj = {};
//                     obj.mission = input_task;
//                     obj.isCompleted = false;
//                     element.task.push(obj);
//                 }
//             })
//             dbinstance.collection("data").updateOne({ "email": "siddharthsharma0722@gmail.com" }, { $set: { "tasks": data.tasks } });
//             res.redirect("/" + hidden);
//         })
//         .catch((err) => {
//             console.log(err);
//         })
// })
