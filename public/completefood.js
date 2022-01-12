async function loadMenu() {

    const res = await fetch('/getcompleteFood')
    const result = await res.json()


    console.log(result)

    for (let orderItem of result) {
        const timecreate = moment(orderItem.created_at).format('YYYY-MM-DD, h:mm:ss a')
        console.log(orderItem)
        document.querySelector(`.food`).innerHTML += `
    <div class="col">
        <div class="card ${orderItem.id}" >

                <h5 class="card-title">Food:${orderItem.food_name}</h5>
                <h5 class="card-title">quantity:${orderItem.quantity}</h5>
                <h5>Table:${orderItem.table_name}</h5>
                <h5>create time:${timecreate}</h5>
            <button id=button onclick="goBack(${orderItem.id})">call Back<button>
            
        </div>
    </div>
    `
}
        // document.querySelector(`#button${orderItem.id}`).addEventListener('click',
        // async ()=>{ 
      
    }


loadMenu()

  async function goBack(id) {
            let list = {
                foodId: id,
                status: "cooking",
            }

            const res = await fetch(`/finshFood`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(list),

            });
            window.location.reload()

            const result =await res.success
            console.log(res.success)

    }

    function go(){
        window.location = 'http://localhost:8080/kitchen.html'
    }
