const socket = io.connect();


let itemList = [];
// let totalCost = 0
const paramsStore = new URLSearchParams(location.search);
const tableNO = paramsStore.get("table");

//convert data from local storage into an array of objects and save
let cartItems = JSON.parse(localStorage.getItem('cartData'));
console.log(cartItems)
let totalCartItem = JSON.parse(localStorage.getItem('cartNumbers'));
let totalCartCost = JSON.parse(localStorage.getItem('totalCost'));


function showItem() {

    let itemContainer = document.querySelector(".show-item");

    if (cartItems) {
        itemContainer.innerHTML = '';
        Object.values(cartItems).map(item => {
            let subtotal = item.price * item.numberOfItm
            console.log('subtotal', subtotal)
            itemContainer.innerHTML += `
            <td>${item.name}</td>
            <td><i class="far fa-minus-square" id="minus${item.id}"></i> ${item.numberOfItm} <i class="far fa-plus-square" id="plus${item.id}"></i></td>
            <td>${item.price}</td>
            <td>${subtotal}</td>
            <td><i class="fas fa-times-circle" id="delete${item.id}"></i></td>
            `
        })
        deleteItem();
        addExistingItem();
        minusExistingItem();
    }


    let totalItem = document.querySelector("#totalitem")
    totalItem.innerHTML =/*HTML*/`${totalCartItem}`

    let total = document.querySelector("#totalcost")
    total.innerHTML =/*HTML*/`${totalCartCost}`



    // for (let food of cartItems){
    //     console.log(food)
    //     console.log(typeof food)
    //     let itemCost = food.price
    //     console.log(itemCost)
    //     console.log(Object.values(cartItems).map(food))
    //     let itemName =food.price

    //     document.querySelector(".show-item").innerHTML =food.name
    // }



    //    let list = document.querySelector(".orderList");
    //    list.appendChild(cartItem);
}
showItem()



function deleteItem() {
    Object.values(cartItems).map(item => {

        document.querySelector(`#delete${item.id}`).

            addEventListener("click", event => {
                console.log(event.target)
                const id = event.target.id;

                const intId = parseInt(id.replace("delete", ""));

                console.log(intId)

                let cartItems2 = [...cartItems]
                console.log(cartItems2)
                let result = cartItems2.filter((v) => v.id != intId)
                console.log(result)
                localStorage.setItem("cartData", JSON.stringify(result))



                /*calculate total cart item number */
                let itemNumber = 0;
                for (let each of result) {
                    itemNumber += each.numberOfItm
                }
                localStorage.setItem("cartNumbers", JSON.stringify(itemNumber))

                /*calculate total cost in the cart */
                let sum = 0;
                for (let each of result) {
                    sum += (each.price * each.numberOfItm)
                }
                localStorage.setItem("totalCost", JSON.stringify(sum))


                location.reload();
            })

    })
}



function addExistingItem(){
    Object.values(cartItems).map(item => {
        document.querySelector(`#plus${item.id}`).
        addEventListener("click", event => {
            console.log(event.target)
            const id = event.target.id;
            const intId = parseInt(id.replace("plus", ""));
            console.log(intId)

            let cartItems3 = [...cartItems]
                console.log(cartItems3)



                let result3 = cartItems3.map( v => {
                    if(v.id == intId){
                        return {...v, numberOfItm: v.numberOfItm + 1 }
                    }
                    else{
                        return v
                    }
                })

                console.log(result3)
                localStorage.setItem("cartData", JSON.stringify(result3))

              /*calculate total cart item number */
              let itemNumber = 0;
              for (let each of result3) {
                  itemNumber += each.numberOfItm
              }
              localStorage.setItem("cartNumbers", JSON.stringify(itemNumber))

              /*calculate total cost in the cart */
              let sum = 0;
              for (let each of result3) {
                  sum += (each.price * each.numberOfItm)
              }
              localStorage.setItem("totalCost", JSON.stringify(sum))


               location.reload();
        })

})
}


function minusExistingItem(){
    Object.values(cartItems).map(item => {
        document.querySelector(`#minus${item.id}`).
        addEventListener("click", event => {
            console.log(event.target)
            const id = event.target.id;
            const intId = parseInt(id.replace("minus",""));
            console.log(intId)

            let cartItems4 = [...cartItems]
                console.log(cartItems4)

                let result4 = cartItems4.map( v => {
                    if(v.id == intId && v.numberOfItm >1){
                        return {...v, numberOfItm: v.numberOfItm - 1 }
                    }
                    else{
                        return v
                    }
                })

                console.log(result4)
                localStorage.setItem("cartData", JSON.stringify(result4))

              /*calculate total cart item number */
              let itemNumber = 0;
              for (let each of result4) {
                  itemNumber += each.numberOfItm
              }
              localStorage.setItem("cartNumbers", JSON.stringify(itemNumber))

              /*calculate total cost in the cart */
              let sum = 0;
              for (let each of result4) {
                  sum += (each.price * each.numberOfItm)
              }
              localStorage.setItem("totalCost", JSON.stringify(sum))


               location.reload();
        })

})
}


// Clear All data with clear button
function clearAll() {
    console.log('clear')
    itemList = []
    document.querySelector(".show-item").innerHTML = ""
    document.querySelector("#totalcost").innerHTML = 0
    document.querySelector("#totalitem").innerHTML = 0
    totalCartItem = 0
    localStorage.removeItem('cartData')
    localStorage.removeItem('cartNumbers')
    localStorage.removeItem('totalCost')

}



//set POST (cart item in localStorage) to server
//need JSON.stringify for body
//localStorage.getItem is already JSON String so no need JSON.stringify
async function submit() {
    const submitItemList = localStorage.getItem('cartData')
    console.log(submitItemList)



    //AJAX: POST to server
    const res = await fetch('/submitOrder',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: submitItemList,
        }
    );

    socket.emit('updateToKitchen', submitItemList)
    const content = await res.json();

    // console.log(content[0].status)


    window.location = `/orderedItemStatus.html?ids=${tableNO}`


    // window.location=`/orderedItemStatus.html?ids=${tableNO}`
    // `/orderedItemStatus.html?ids=${JSON.stringify(ids)}`
}

// async function checkStatus() {
//     const submitItemList = localStorage.getItem('cartData')

//     if(submitItemList == undefined) {
//         return
//     }

//     // console.log(submitItemList)

//     const res = await fetch('/checkStatus',
//         {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json; charset=utf-8",
//             },
//             body: submitItemList,
//         }
//     );

//     const result = await res.json();

//     console.log(result)

// }



// if(){

// }


document.querySelector('#confirm')
    .addEventListener('click', function () {

        // checkStatus()


        submit();




        clearAll();
    })


    document.querySelector('#clear')
    .addEventListener('click', function () {
        clearAll();
    })


//load the tabelNO in query
    document.querySelector("#menu").addEventListener("click", event => {
        // console.log(event.target)
        window.location = `/c-menu.html?table=${tableNO}`
    });
    
    document.querySelector("#shoppingCart").addEventListener("click", event => {
        // console.log(event.target)
        window.location = `/cart.html?table=${tableNO}`
    });
    
    document.querySelector("#status").addEventListener("click", event => {
        // console.log(event.target)
        window.location = `/orderedItemStatus.html?table=${tableNO}`
    });