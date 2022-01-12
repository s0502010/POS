const socket = io.connect();

async function loadseats() {
    // const seat = await fetch('/getSeat')
    // const seatstatus = await seat.json()

    const res = await fetch('/getSeat')
    const result = await res.json()

    document.querySelector("#dine-in").innerHTML = ``


    ///order-system.html?${seat.name}

    for (let seat of result.rows) {
        // console.log(seat)

        document.querySelector("#dine-in").innerHTML += `
        <div class="col">
            <div class="card ${seat.name}" id="${seat.name}-id">
                
                    <div><h5 class="card-title">${seat.name}</h5></div>
                    <div><p class="card-text fw-bold">${seat.status}</p></div>
               
            </div>
        </div>
        ` 
    }

    for (let seat of result.rows) {
        document.querySelector(`#${seat.name}-id`).addEventListener("click", ()=>{
            window.location = `order-system.html?table=${seat.name}`
        })
    }


}

loadseats()

socket.on("updateSeat", (data) =>{ loadseats() })

// function opentable(url){
//     console.log(url)

//     //location.replace= ('url')
//     window.location = url

// }
//10
// windows.locations = "/order-system.html?table=10"
// windows.locations = "/order-system.html?table=" + id

// function opentable(${seat.name}){
//     window.location = "order-system.html?${seat.name}"

// }

