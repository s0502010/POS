
function totalCheck(itemList) {

    let totalItem = 0;
    let totalCost = 0;

    // itemList.forEach(item => {
    //     totalItem += item.quantity;
    // })

    // totalCost = itemList.reduce((acc, item) => {
    //     return acc + (item.price * item.quantity);
    // }, 0);

    let a = document.querySelector('.totalTable')

    for(let total of itemList){
        totalItem += JSON.parse(total.sum)
        totalCost += JSON.parse(total.num)

        node = document.createElement("tr");
        td = document.createElement("td")
        tda = document.createElement("td")
        tdb = document.createElement("td")

        node.setAttribute('class', total.food_name)

       food_name = document.createTextNode( total.food_name);

       
       food_sum = document.createTextNode(total.sum);

        
       food_num = document.createTextNode('$' +total.num);

        td.appendChild(food_name)
        tda.appendChild(food_sum)
        tdb.appendChild(food_num)

        node.appendChild(td)
        node.appendChild(tda)
        node.appendChild(tdb)
        a.appendChild(node)
    }


    console.log(totalItem)
    console.log(totalCost)


    document.getElementById("totalitem").innerHTML = totalItem;

    document.getElementById("totalRevenue").innerHTML = '$'+ totalCost.toFixed(1)

    // console.log(itemList.map((a)=>{
    //     return a.food_name && a.price
    // }))



    // var node = document.createElement("tr");

    // var textnode = document.createTextNode("Water");

    // node.appendChild(textnode);

    // document.getElementById("myList").appendChild(node);

}

async function getRevenue() {
    const menuItem = await fetch("/revenueReview");
    const menuItemLists = await menuItem.json();
    itemList = menuItemLists;
    
    totalCheck(itemList)

    console.log(itemList)
}

getRevenue()



// let foodArr = []

// for(let val of a){

//     let found = false;

//     for(let food in foodArr){

//         if(val.food_name == foodArr[food][0]){
//             foodArr[food][1] += val.quantity
//             found = true
//             break;
            
//         }
//     }

//     !found && foodArr.push([val.food_name, val.quantity]) // new item
// }

// console.log(foodArr)

// let mp = new Map();

// for(let val of a){

//     if(mp.has(val.food_name)){
//         mp.set(val.food_name, mp.get(val.food_name) + val.quantity)

//     }
//     else{
//         mp.set(val.food_name, val.quantity)
//     }

// }

// console.log(mp)
// console.log(new Array(...mp))