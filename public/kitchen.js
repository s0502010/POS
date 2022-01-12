const socket = io.connect();

async function loadMenu() {

    const res = await fetch('/getOrderFood')
    const result = await res.json()

    document.querySelector(`.food`).innerHTML = ``

    // console.log(result)

    for (let orderItem of result) {
        const timecreate = moment(orderItem.created_at).add(8, 'hours').format('YYYY-MM-DD, h:mm:ss a')
        // console.log(orderItem)
        document.querySelector(`.food`).innerHTML += `
    <div class="col">
        <div class="card ${orderItem.id}" >

                <h5 class="card-title">Food: ${orderItem.food_name}</h5>
                <h5 class="card-title">quantity: ${orderItem.quantity}</h5>
                <h5>Table: ${orderItem.table_name}</h5>
                <h5>create time:${timecreate}</h5>
            <button id=button onclick="Done(${orderItem.id})">Done<button>
            
        </div>
    </div>
    `
    }
}

socket.on("update", ()=>{
    console.log(1111)
    loadMenu()
})



loadMenu()

async function Done(id) {
    let list = {
        foodId: id,
        status: "complete",
    }

    const res = await fetch(`/finshFood`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(list),

    });
    window.location.reload()

    const result = await res.success
    // console.log(res.success)

}


function go() {
    window.location = 'http://localhost:8080/completefood.html'
}
