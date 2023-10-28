let passwd = document.querySelector("#showpassword");
let password = document.querySelector("#password");

passwd.addEventListener(("click"), () => {
    if (password.type === "password") {
        password.type = "text";
    }
    else {
        password.type = "password"
    }
})

let email=document.getElementById("email");
let label1=document.getElementById("label1");
email.addEventListener("click",()=>{
    label1.style.top=80+"px";
    label1.style.fontSize=20+"px";
})

let label2=document.getElementById("label2");
password.addEventListener("click",()=>{
    label2.style.top=160+"px";
    label2.style.fontSize=20+"px";
})