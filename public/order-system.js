// const orderItem = {
//     name: "food 1",
//     price: 32,
//     pic: "image.png"
// }

const socket = io.connect();
// const { io } = require("../server")

//load menu

let typeList = []
let foodList = []

async function loadMenu() {
    const menuType = await fetch('/getMenuType')
    const menuTypeList = await menuType.json()

    for (let menuTypeLists of menuTypeList.rows) {
        // console.log(menuTypeLists)
        typeList.push(menuTypeLists.type)
    }

    // console.log(typeList)
    // for (let typeName of typeList) {
    //     addingCategoryHTML(typeName)
    // }

    const res = await fetch('/getMenuItem')
    const result = await res.json()
    let foodList = []

    // for (let results of result.rows) {
    //     list.push(results.type)
    // }
    let temp = true;
    for (let results of typeList) {
        let str = "";

        if (temp) {
            temp = false
            str = "active";
        }

        document.querySelector('#v-pills-tab').innerHTML += `
        
            <button class="nav-link ${str}" id="v-pills-${results}-tab" data-bs-toggle="pill" data-bs-target="#v-pills-${results} "
              type="button" role="tab" aria-controls="${results}" aria-selected="true">${results}</button>

        `
    }

    //let strArr = [];

    //let num = 0;
    for (let results of typeList) {
        // console.log(results)
        foodList.push(results)
        document.querySelector('.tab-content').innerHTML += `
            <div class="tab-pane fade show active" id="v-pills-${results}" role="tabpanel" aria-labelledby="v-pills-${results}-tab">
                <div class="row row-cols-1 row-cols-md-4 g-4" id='${results}-contain'>

                </div>
            </div>
            `
    }

    console.log()


    getOrderedItem()



    for (let menuItem of result.rows) {
        // console.log(menuItem)
        document.querySelector(`#${menuItem.type}-contain`).innerHTML += `
    <div class="col">
        <div class="card" onclick="orderbasket('${menuItem.name}','${menuItem.price}','${menuItem.image}','${menuItem.type}');">
            <img draggable="false" src="${menuItem.image}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${menuItem.name}</h5>
                <p class="card-text fw-bold">$${menuItem.price}</p>
            </div>
        </div>
    </div>
    `
    }

}

loadMenu()

var timeInMs = new Date().toLocaleString();
document.querySelector(".time").innerHTML = timeInMs

// console.log(foodList)

//order menu
let itemList = [];
let totalCost = 0

// window.onload = () => {
let paramsStore = new URLSearchParams(location.search);
let tableNO = paramsStore.get("table");
console.log(tableNO);
//     itemList.push(tableNO);
// };


document.querySelector(".tablename").innerHTML = tableNO


function orderbasket(itemname, itemprice, itemimage, itemtype) {
    const paramsStore = new URLSearchParams(location.search);
    const tableNO = paramsStore.get("table");

    var exist = false;
    let item = {
        name: itemname,
        numberOfItm: 1,
        price: itemprice,
        pic: itemimage,
        tableNO: tableNO,
        type: itemtype,
        status: "cooking"
    }

    if (itemList.length > 0) {
        itemList.forEach(itemInItemList => {
            if (itemInItemList.name == itemname) {

                itemInItemList.numberOfItm++;

                let oldSpan = document.getElementById('count_' + itemInItemList.name);

                oldSpan.innerHTML = itemInItemList.numberOfItm;


                exist = true;

            }
        })
    }
    if (!exist) {
        console.log("!exist");
        console.log(item);
        itemList.push(item);
        createOrderItemUI(item);


    }
    totalCost = itemList.reduce((acc, item) => {
        return acc + (item.price * item.numberOfItm);
    }, 0);
    totalcheck()
    //UI
    console.log(itemList);

}

// io.emit('updateToKitchen', 





document.querySelector(".sent").addEventListener("click", async (event) => {
    event.preventDefault();
    let data = itemList


    console.log(data)
    let res = await fetch("/reciveOrderList", {
        method: "POST", // Specify your HTTP method
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data), // Specify the Request Body

    });

    let result = await res.json();
    console.log(result)
    socket.emit('updateToKitchen', itemList)



    window.location = "/tablestatus.html"
})

document.querySelector(".resetTable").addEventListener("click", async (event) => {
    //event.preventDefault();
    // console.log(tableNO)

    let data = { originStatus: 'free', currentStatus: 'serving', name: tableNO, foodStatus: 'paid' }
    let res = await fetch("/resetTable", {
        method: "PUT", // Specify your HTTP method
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data), // Specify the Request Body
    });

    let result = await res.json();
    console.log(result)



    window.location = "/tablestatus.html"

})

async function getOrderedItem() {
    let data = { tableName: tableNO }
    // console.log(data)

    let res = await fetch("/getOrderItem", {
        method: "Post", // Specify your HTTP method
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data), // Specify the Request Body
    });

    let result = await res.json();

    // let item = result

    
    for (let item of result) {
        const orderlist = document.getElementById("ordereditem")
        //create Li tag
        const orderitem = document.createElement('li');
        orderitem.className = 'd-flex justify-content-between align-items-center'
        //create a span for red calor
        const orderitempricespan = document.createElement('span');
        //create the text node
        const orderitemname = document.createTextNode(item.food_name)
        const numbercount = document.createElement('span')
        numbercount.id = 'count_' + item.food_name;
        const firstcount = document.createTextNode(item.quantity)

        const orderitemprice = document.createTextNode(" $ " + item.price)

        orderitempricespan.className = 'text-danger';

        orderitempricespan.appendChild(orderitemprice)
        numbercount.appendChild(firstcount)

        // const orderitemimgtag = document.createElement('img');
        // orderitemimgtag.src = item.pic;
        // orderitemimgtag.className = 'w-25 rounded border border-dark';
        // orderitem.appendChild(orderitemimgtag)
        orderitem.appendChild(orderitemname)
        orderitem.appendChild(numbercount)
        orderitem.appendChild(orderitempricespan)
        //attach or append the Li tag (child)to parent id=ORDERLIST
        orderlist.appendChild(orderitem)
    }

    orderedCost = result.reduce((acc, result) => {
        return acc + (result.price * result.quantity);
    }, 0);
    

    const a = document.getElementById("orderedcast")
    const totalPrice= document.createTextNode(orderedCost.toFixed(1))
    // const 
    a.appendChild( totalPrice)

    console.log(result)

    
}

function createOrderItemUI(item) {
    const orderlist = document.getElementById("orderlist");
    //create Li tag
    const orderitem = document.createElement('li');
    orderitem.className = 'd-flex justify-content-between align-items-center'
    //create a span for red calor
    const orderitempricespan = document.createElement('span');
    //create the text node
    const orderitemname = document.createTextNode(item.name)
    const numbercount = document.createElement('span')
    numbercount.id = 'count_' + item.name;
    const firstcount = document.createTextNode(1)
    const delite = document.createElement('button')
    delite.id = item.name
    const deliteBtn = document.createTextNode('delete')
    delite.appendChild(deliteBtn)
    const orderitemprice = document.createTextNode(" $ " + item.price)

    orderitempricespan.className = 'text-danger';

    orderitempricespan.appendChild(orderitemprice)
    numbercount.appendChild(firstcount)

    const orderitemimgtag = document.createElement('img');
    orderitemimgtag.src = item.pic;
    orderitemimgtag.className = 'w-25 rounded border border-dark';
    orderitem.appendChild(orderitemimgtag)
    orderitem.appendChild(orderitemname)
    orderitem.appendChild(numbercount)
    orderitem.appendChild(orderitempricespan)
    orderitem.appendChild(delite)

    //attach or append the Li tag (child)to parent id=ORDERLIST
    orderlist.appendChild(orderitem)



    delite.addEventListener('click', function () {
        if (item.numberOfItm == 1) {
            this.closest('li').remove()
            itemList.splice(itemList.indexOf(item), 1)
            totalCost = totalCost - item.price
        }

        else {
            itemList.forEach(itemInItemList => {
                console.log(itemInItemList.name, item.name)
                if (itemInItemList.name == item.name) {
                    //continue}
                    itemInItemList.numberOfItm--;
                    // let newSpan = document.createElement("span");
                    let oldSpan = document.getElementById('count_' + itemInItemList.name);
                    // const newContent = document.createTextNode(c);
                    oldSpan.innerHTML = itemInItemList.numberOfItm;
                    // newSpan.appendChild(newContent);
                    // document.body.insertBefore(newSpan, oldSpan);

                    exist = true;
                    console.log("hi");
                }
                totalCost = totalCost - item.price
                totalcheck()

            })
        }
    })
}


function totalcheck() {
    var totalItem = 0;
    itemList.forEach(item => {
        totalItem += item.numberOfItm;
    })

    document.getElementById("totalitem").innerHTML = totalItem.toFixed(1);
    document.getElementById("totalcast").innerHTML = totalCost.toFixed(1)

}
function clear() {
    console.log('clear')
    itemList = []
    document.getElementById("orderlist").innerHTML = ""
    totalCost = 0
    totalItem = 0
    totalcheck()
}

document.querySelector('#clean')
    .addEventListener('click', function () {
        clear();

    });

document.querySelector('.sent')
    .addEventListener('click', function () {
        clear();

    });

function loadOrderItem() {
    for (let item of itemList) {
        createOrderItemUI(item)
    }
}


// console.log(totalCost)

async function resetSeat() {
    fetch
}


