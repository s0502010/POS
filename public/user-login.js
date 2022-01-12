let x = document.getElementById("sign-in");
let y = document.getElementById("register");

function signIn() {
    y.style.display = "none";
    x.style.display = "block";
}

function register() {
    x.style.display = "none";
    y.style.display = "block";
    document.querySelector(".loginFail").style.display = "none";
}

let searchParams = new URLSearchParams(location.search);
const mode = searchParams.get("mode")
// for (let p of searchParams) {
//     console.log(p[1]);
//   }
if (mode == 'register') {
    console.log("reg")
    register();
} else {
    console.log("login")

    signIn();
}

// Member login 
document.querySelector("#login").addEventListener("submit", async (event) => {
    event.preventDefault();
    let userLogin = event.target;
    let loginInput = {
        userName: userLogin.loginName.value,
        userPwd: userLogin.loginPwd.value,
    }

    // console.log(111)
    const res = await fetch("/userLogin", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(loginInput)
    });

    const result = await res.json();
    console.log(result.success)
    // console.log(111222)

    if (result.success == "admin") {
        //***changed to staff.html page 
        window.location = '/loginSuccessAdmin.html';
    } else if (result.success == "user") {
        window.location = '/login-success.html';
    } else {
        document.querySelector(".loginFail").style.display = "block";
    }
})

// New register
document.querySelector("#newRegister").addEventListener("submit", async (event) => {
    event.preventDefault();
    let registerForm = event.target;

    let registerInput = {
        userName: registerForm.yourName.value,
        userPhoneNumber: registerForm.userPhoneNumber.value,
        // userEmailID: registerForm.emailID.value,
        userDateOfBirth: registerForm.userDateOfBirth.value,
        userGender: registerForm.userGender.value,
        password: registerForm.pwd.value
    }
    const res = await fetch("/userRegister", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(registerInput)
    });
    const result = await res.json(); //result = {success:true}

    if (result.success) {
        //***changed to staff.html page 
        // location.reload();
        window.location = '/user-login.html';
    }
})

//guest login

document.getElementById("guest").addEventListener("click", async (event) => {
    event.preventDefault();
    
    const res = await fetch("/guestLogin");
   
    const result = await res.json();
    if (result.success == true) {
        window.location = '/login-success.html';
    }
})