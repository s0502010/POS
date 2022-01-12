//guest login

document.getElementById("guestLogin").addEventListener("click", async (event) => {
    event.preventDefault();
    
    const res = await fetch("/guestLogin");
   
    const result = await res.json();
    if (result.success) {
        window.location = '/login-success.html';
    }
})


let a = "hiii";
let b = false;

console.log (!!a) // true
console.log (!!b) // false


