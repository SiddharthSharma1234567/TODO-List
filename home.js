let checkboxArray = document.querySelectorAll("#checkbox");
let myform = document.querySelector("#myform");
let myform2 = document.querySelector("#myform2");
let hiddeninput = document.querySelector("#hidden_input1");
let hiddeninput2 = document.querySelector("#hidden_input2");
let hiddeninput3 = document.querySelector("#hidden_input3");
let hiddeninput4 = document.querySelector("#hidden_input4");
let delete_btn = document.querySelectorAll("#delete_icon");

checkboxArray.forEach((item) => {
    item.addEventListener("click", () => {
        console.log("hello guys")
        let val1 = item.getAttribute("data-category");
        let val2 = item.getAttribute("data");
        axios.post("http://localhost:3000/isCompleted", { "hidden_category": val1, "hidden_task": val2 })
            .then((res) => {
                let show_task_area = document.getElementById("show_task_area");     
                show_task_area.innerHTML = "";

                const result = res.data;
                const filtered_data = result.tasks.filter((task) => { return task.category === val1 });

                if (filtered_data.length !== 0) {
                    filtered_data.map((items, index) => {
                        let show_task = document.createElement("div");
                        show_task.id = "show_task";
                        if (items.isCompleted) {
                            show_task.innerHTML = `
                            <div id="checkbox_area">
                                <div
                                id="checkbox"
                                data=${items.task}
                                data-category=${items.category}
                                style="
                                    height: 20px;
                                    width: 20px;
                                    background-color: rgb(60, 237, 6);
                                    border-radius: 100%;
                                    border: 2px solid rgb(65, 64, 64);
                                    cursor: pointer;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                "
                                >
                                <i class="fa-solid fa-check" style="color: #ffffff"></i>
                                </div>
                            </div>
                            <div
                                id="show_task_text"
                                style="color: rgb(65, 64, 64); text-decoration: line-through"
                            >
                                ${items.task}
                            </div>
                            <div
                                style="
                                width: 50px;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                "
                            >
                                <div
                                id="delete_task"
                                style="
                                    width: 100%;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                "
                                >
                                <i
                                    class="fa-solid fa-trash"
                                    id="delete_icon"
                                    data=${items.task}
                                    data-category=${items.category}
                                ></i>
                                </div>
                            </div>
                        `
                        } else {
                            show_task.innerHTML = `
                            <div id="checkbox_area">
                                <div
                                id="checkbox"
                                data=${items.task}
                                data-category=${items.category}
                                style="
                                    height: 20px;
                                    width: 20px;
                                    background-color: white;
                                    border-radius: 100%;
                                    border: 2px solid rgb(65, 64, 64);
                                    cursor: pointer;
                                "
                                >
                                </div>
                            </div>
                            <div
                                id="show_task_text"
                                style="color: rgb(65, 64, 64)"
                            >
                                ${items.task}
                            </div>
                            <div
                                style="
                                width: 50px;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                "
                            >
                                <div
                                id="delete_task"
                                style="
                                    width: 100%;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                "
                                >
                                <i
                                    class="fa-solid fa-trash"
                                    id="delete_icon"
                                    data=${items.task}
                                    data-category=${items.category}
                                ></i>
                                </div>
                            </div>
                        `
                        }
                        show_task_area.appendChild(show_task);
                    })
                    input_task.value = "";
                }
            })
    });
})

delete_btn.forEach((item) => {
    item.addEventListener("click", () => {
        hiddeninput3.value = item.getAttribute("data-category");
        hiddeninput4.value = item.getAttribute("data");
        myform2.submit();
    })
})

let add_category = document.getElementById("categories");
add_category.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const val = add_category.value;
        axios.post("http://localhost:3000/taskcategories", { "categories": val })
            .then((res) => {
                let category_area = document.getElementById("categories_area");
                const divCount = category_area.querySelectorAll("div").length;
                const newCategoryElement = document.createElement("div");
                newCategoryitems.id = "categories_area_tasks"; // Update this ID as needed
                if ((divCount + 1) % 2 === 0) {
                    newCategoryitems.innerHTML = `
                    <div id="categories_area_tasks" style="background-color: rgb(215, 215, 215)">
                        <div id="categories_area_tasks_icon">
                            <i class="fa-solid fa-list-check" style="color: #000000"></i>
                        </div>
                        <div id="categories_area_tasks_name">
                            <a href="/<%=items%>" style="text-decoration: none; color: black"
                            >${val}</a
                            >
                        </div>
                    </div>
                    `;
                }
                else {
                    newCategoryitems.innerHTML = `
                    <div id="categories_area_tasks" style="background-color: none">
                        <div id="categories_area_tasks_icon">
                            <i class="fa-solid fa-list-check" style="color: #000000"></i>
                        </div>
                        <div id="categories_area_tasks_name">
                            <a href="/<%=items%>" style="text-decoration: none; color: black"
                            >${val}</a
                            >
                        </div>
                    </div>
                    `;
                }
                category_area.appendChild(newCategoryElement);
                add_category.value = "";
            })
            .catch((err) => {
                console.log(err);
            })
    }
})

let input_task = document.getElementById("input_task");
let hidden = document.getElementById("hidden_input").value;
input_task.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const val = input_task.value;

        axios.post("http://localhost:3000/addtaskdata", { "input_task": val, "hidden": hidden })
            .then((res) => {
                let show_task_area = document.getElementById("show_task_area");
                show_task_area.innerHTML = "";

                const result = res.data;
                const filtered_data = result.tasks.filter((task) => { return task.category === hidden });


                if (filtered_data.length !== 0) {
                    filtered_data.map((items, index) => {
                        let show_task = document.createElement("div");
                        show_task.id = "show_task";
                        if (items.isCompleted) {
                            show_task.innerHTML = `
                                <div id="checkbox_area">
                                    <div
                                    id="checkbox"
                                    data=${items.task}
                                    data-category=${items.category}
                                    style="
                                        height: 20px;
                                        width: 20px;
                                        background-color: rgb(60, 237, 6);
                                        border-radius: 100%;
                                        border: 2px solid rgb(65, 64, 64);
                                        cursor: pointer;
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                    "
                                    >
                                    <i class="fa-solid fa-check" style="color: #ffffff"></i>
                                    </div>
                                </div>
                                <div
                                    id="show_task_text"
                                    style="color: rgb(65, 64, 64); text-decoration: line-through"
                                >
                                    ${items.task}
                                </div>
                                <div
                                    style="
                                    width: 50px;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    "
                                >
                                    <div
                                    id="delete_task"
                                    style="
                                        width: 100%;
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                    "
                                    >
                                    <i
                                        class="fa-solid fa-trash"
                                        id="delete_icon"
                                        data=${items.task}
                                        data-category=${items.category}
                                    ></i>
                                    </div>
                                </div>
                            `
                        } else {
                            show_task.innerHTML = `
                                <div id="checkbox_area">
                                    <div
                                    id="checkbox"
                                    data=${items.task}
                                    data-category=${items.category}
                                    style="
                                        height: 20px;
                                        width: 20px;
                                        background-color: white;
                                        border-radius: 100%;
                                        border: 2px solid rgb(65, 64, 64);
                                        cursor: pointer;
                                    "
                                    >
                                    </div>
                                </div>
                                <div
                                    id="show_task_text"
                                    style="color: rgb(65, 64, 64)"
                                >
                                    ${items.task}
                                </div>
                                <div
                                    style="
                                    width: 50px;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    "
                                >
                                    <div
                                    id="delete_task"
                                    style="
                                        width: 100%;
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                    "
                                    >
                                    <i
                                        class="fa-solid fa-trash"
                                        id="delete_icon"
                                        data=${items.task}
                                        data-category=${items.category}
                                    ></i>
                                    </div>
                                </div>
                            `
                        }
                        show_task_area.appendChild(show_task);
                    })
                    input_task.value = "";
                }
            })
    }
})