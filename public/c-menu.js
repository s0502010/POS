let menuList = document.querySelector('.menu-list')
let menuItemTemplate = menuList.querySelector('.dishes')
menuList.querySelectorAll('.dishes').forEach(e => e.remove())

let navbarList = document.querySelector('.n')
// let navbarItem = navbarList.querySelector('.box-container')
// navbarItem.querySelectorAll('.box').forEach(e => e.remove())
const paramsStore = new URLSearchParams(location.search);
const tableNO = paramsStore.get("table");

console.log(tableNO)

const typeList = []

//load menu
async function loadMenu() {

  //convert data from database to json for AJAX
  //use fecth to do-> HTTP Request (Method:GET + Path:/getcmenuType)
  const res = await fetch('/c-menu')
  const json = await res.json()
  console.log(json)

  let htmlStr = ``
  //select only type name of the menuType from the rows (Method: GET,'/getcmenuType', cmenu.ts)
  //add into a new array
  for (let menu of json) {
    typeList.push(menu.type)
    console.log(menu.type)


    htmlStr += /*HTML*/`
    <div class="box">
      <a href="#${menu.type}">${menu.type}</a>
    </div>
    `
    navbarList.innerHTML = htmlStr

    //add menu-type for section
    let menuItem = menuItemTemplate.cloneNode(true)
    menuItem.querySelector('.heading').textContent = menu.type

    //add dishes for box display menu
    let foodContainer = menuItem.querySelector('.box-container')
    let foodTemplate = foodContainer.querySelector('.box')
    foodContainer.querySelectorAll('.box').forEach(e => e.remove())

    let increaseNum = 0;
    for (let food of menu.foodList) {
      let foodNode = foodTemplate.cloneNode(true)
      foodNode.querySelector('.box-name').textContent = food.name;
      foodNode.querySelector('.box-price').textContent = '$' + food.price;
      foodNode.querySelector('.btn').id = "btns" + menu.type + increaseNum++;
      foodNode.querySelector(".img1").src =food.image;
    

      foodContainer.appendChild(foodNode)

    }

    menuList.appendChild(menuItem)
    console.log(menuItem)

    console.log(`menu.foodList:`, menu.foodList)


    //Add click event to the add to cart 
    for (let i = 0; i < menu.foodList.length; i++) {



      document.getElementById("btns" + menu.type + i).addEventListener("click", () => {
        console.log("added to cart", "btns" + menu.type + i)



        let item = {
          id: menu.foodList[i].id,
          name: menu.foodList[i].name,
          numberOfItm: 1,
          price: menu.foodList[i].price,
          tableNO: tableNO,
          type: menu.foodList[i].type,
          status: "cooking",
        }

        // let itemList = []
        // if (itemList.length > 0) {
        //   itemList.forEach(itemInItemList => {
        //     if (itemInItemList.name == itemname) {
        //     itemInItemList.numberOfItm++;

        //     exist = true;
        //   }})
        // } if (!exist) {
        //   console.log("!exist");
        //   console.log(item);
        //   itemList.push(item);
        // }
        // console.log('itemList', itemList)
        // console.log('item', itemList)



        cartNumbers(item);
        let foodprice = Object.values(menu.foodList)
        console.log(`food price is `, foodprice)
        console.log("type", typeof foodprice)
        // Object.values(menu.foodList).forEach(value =>{
        //   console.log(menu.foodList[i])

        // })
        totalCost(item);
        console.log(menu.foodList[i])
      })

    }

  }

  // for (let i = 0; i < carts.length; i++) {

  //   console.log("looping" , i)

  //   document.getElementById("btns" + i).addEventListener('click', () => {
  //     console.log("added to cart")


  //     cartNumbers(i);
  //   })

  // }

}
console.log(typeList)
//console.log(navbarItem)

loadMenu();









console.log(document.querySelector("#shoppingCart"));

function onLoadCartNumbers() {
  let foodNumbers = localStorage.getItem(`cartNumbers`);

  if (foodNumbers) {
    document.querySelector('.select span').textContent = `(${foodNumbers})`
  }
}

onLoadCartNumbers();


//Stor cart data in local storage
function cartNumbers(data) {

  console.log("btn", data)

  let shoppingCart = localStorage.getItem('cartData');
  let foodNumbers = localStorage.getItem('cartNumbers');


  //Add to cart -> local storage to save the food items
  if (!shoppingCart) {
    localStorage.setItem('cartData', JSON.stringify([data]));
  }
  else {
    let newData = JSON.parse(shoppingCart);
    console.log('newData', newData);
    console.log('data', data);
    let exist = false;
    if (newData.length > 0) {
      newData.forEach(itemInNewData => {
        if (itemInNewData.name == data.name) {
          itemInNewData.numberOfItm++;
          exist = true;
        }
      })
    } if (!exist) {
      console.log("!exist");
      console.log(data);
      newData.push(data);
    }
    // newData.push(data)
    localStorage.setItem('cartData', JSON.stringify(newData));
  }

  //local storage can only store string, convert to num so that we can +1
  foodNumbers = parseInt(foodNumbers);
  //localStorage.setItem('cartNumbers',1);
  console.log(`foodNumbers`, foodNumbers)

  //display number of items in cart
  if (foodNumbers) {
    localStorage.setItem('cartNumbers', foodNumbers + 1)
    document.querySelector('.select span').textContent = `(${foodNumbers + 1})`
  } else {
    localStorage.setItem('cartNumbers', 1)
    document.querySelector('.select span').textContent = `(1)`
  }

}

// document.querySelector('.shopping').addEventListener("click", async () => {
//   console.log('sjasdjhfasijfsdijfsdakfjdash')
// });




function totalCost(total) {
  let cartCost = parseInt(localStorage.getItem('totalCost'));
  console.log('cartCost is', cartCost)

  if (cartCost) {
    localStorage.setItem("totalCost", cartCost + parseInt(total.price));
  } else {
    localStorage.setItem("totalCost", total.price);
  }
}


document.querySelector("#menu").addEventListener("click",event=>{
  // console.log(event.target)
  window.location = `/c-menu.html?table=${tableNO}`
});

document.querySelector("#shoppingCart").addEventListener("click",event=>{
  // console.log(event.target)
  window.location = `/cart.html?table=${tableNO}`
});

document.querySelector("#status").addEventListener("click", event => {
  // console.log(event.target)
  window.location = `/orderedItemStatus.html?table=${tableNO}`
});

// //add meunu type

// let menuSection = document.querySelectorAll('body')
// function addMenuType(menuType) {
//   let addSection = document.createElement('section')
//   addSection.sectionName = `${menuType}`
//   addSection.innerHTML =/*HTML*/`
//   <h3 class="sub-heading">${menuType}</h3>
//   <h1 class="heading"> popular dishes </h1>`

//   menuSection.appendChild(div)
// }

// //add menu item into the menu list in html
// let foodContainer = document.querySelector('#food-container')
// function showFood(foodName) {
//   let foodDiv = document.createElement('div')
//   foodDiv.className = 'box'
//   foodDiv.innerHTML =
//     `  <a href="#" class="fas fa-heart"></a>
//   <img src="images/dish-1.png" alt="">
//   <h3>${foodName}</h3>
//   <div class="stars">

//   </div>
//   <span>$15.99</span>
//   <a href="#" class="btn">add to cart</a>`
//   foodContainer.appendChild(foodDiv)
// }





// let menu = document.querySelector('#menu-bars');
// let navbar = document.querySelector('.navbar');

// menu.onclick = () =>{
//   menu.classList.toggle('fa-times');
//   navbar.classList.toggle('active');
// }

// let section = document.querySelectorAll('section');
// let navLinks = document.querySelectorAll('header .navbar a');

// window.onscroll = () =>{

//   menu.classList.remove('fa-times');
//   navbar.classList.remove('active');

//   section.forEach(sec =>{

//     let top = window.scrollY;
//     let height = sec.offsetHeight;
//     let offset = sec.offsetTop - 150;
//     let id = sec.getAttribute('id');

//     if(top >= offset && top < offset + height){
//       navLinks.forEach(links =>{
//         links.classList.remove('active');
//         document.querySelector('header .navbar a[href*='+id+']').classList.add('active');
//       });
//     };

//   });

// }

// document.querySelector('#search-icon').onclick = () =>{
//   document.querySelector('#search-form').classList.toggle('active');
// }

// document.querySelector('#close').onclick = () =>{
//   document.querySelector('#search-form').classList.remove('active');
// }

// var swiper = new Swiper(".home-slider", {
//   spaceBetween: 30,
//   centeredSlides: true,
//   autoplay: {
//     delay: 7500,
//     disableOnInteraction: false,
//   },
//   pagination: {
//     el: ".swiper-pagination",
//     clickable: true,
//   },
//   loop:true,
// });

// var swiper = new Swiper(".review-slider", {
//   spaceBetween: 20,
//   centeredSlides: true,
//   autoplay: {
//     delay: 7500,
//     disableOnInteraction: false,
//   },
//   loop:true,
//   breakpoints: {
//     0: {
//         slidesPerView: 1,
//     },
//     640: {
//       slidesPerView: 2,
//     },
//     768: {
//       slidesPerView: 2,
//     },
//     1024: {
//       slidesPerView: 3,
//     },
//   },
// });

// function loader(){
//   document.querySelector('.loader-container').classList.add('fade-out');
// }

// function fadeOut(){
//   setInterval(loader, 3000);
// }

// window.onload = fadeOut;