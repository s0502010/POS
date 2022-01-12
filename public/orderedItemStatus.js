const socket = io.connect();

let id;

const paramsStore = new URLSearchParams(location.search);
const tableNO = paramsStore.get("table");

const customerSeatId = async () => {
  const res = await fetch(`/seatID`);
  const result = await res.json();
  id = result.seatID;
};

const orderedList = async () => {
  console.log(id);

  const res = await fetch(`/userOrderedDish`);
  const result = await res.json();

  console.log(result);

  //after showing the ordered dish from res.json
  let appetizerCounter = 0;
  let mainDishCounter = 0;
  let sideDishCounter = 0;
  let dessertCounter = 0;
  let drinkCounter = 0;

  //document.getElementsByClassName("item-container").innerHTML = ``;

  for (let each_obj of result) {
    if (each_obj.type == "dessert") {
      //check dessert type
      let orderedDessertItem = document.getElementById("ordered-dessert-item");
      let newOrderedDessertItem = document.createElement("div");
      newOrderedDessertItem.textContent = each_obj.food_name;
      orderedDessertItem.appendChild(newOrderedDessertItem);

      //check dessert quantity
      let orderedDessertQuantity = document.getElementById(
        "ordered-dessert-quantity"
      );
      let newOrderedDessertQuantity = document.createElement("div");
      newOrderedDessertQuantity.textContent = each_obj.quantity;
      orderedDessertQuantity.appendChild(newOrderedDessertQuantity);

      // check status
      switch (each_obj.status) {
        case "cooking":
          let processingIcon = document.getElementById("dessert-processing");
          let newProcessingIcon = document.createElement("div");
          newProcessingIcon.innerHTML = `Preparing <i id="dessert-statusIcon1" class="fas fa-sync-alt"></i>`;
          processingIcon.appendChild(newProcessingIcon);
          break;

        case "complete":
          let readyIcon = document.getElementById("dessert-processing");
          let newReadyIcon = document.createElement("div");
          newReadyIcon.innerHTML = `<span id="readyText">Ready!</span> <i id="dessert-statusIcon2" class="fas fa-check-circle"></i>`;
          readyIcon.appendChild(newReadyIcon);
          break;
      }

      dessertCounter++;
    } else if (each_obj.type == "main") {
      //check main dish type
      let orderedMainDishItem = document.getElementById(
        "ordered-main-dish-item"
      );
      let newOrderedMainDishItem = document.createElement("div");
      newOrderedMainDishItem.textContent = each_obj.food_name;
      orderedMainDishItem.appendChild(newOrderedMainDishItem);

      //check main dish quantity
      let orderedMainDishQuantity = document.getElementById(
        "ordered-main-dish-quantity"
      );
      let newOrderedMainDishQuantity = document.createElement("div");
      newOrderedMainDishQuantity.textContent = each_obj.quantity;
      orderedMainDishQuantity.appendChild(newOrderedMainDishQuantity);

      //check status
      switch (each_obj.status) {
        case "cooking":
          let processingIcon = document.getElementById("main-dish-processing");
          let newProcessingIcon = document.createElement("div");
          newProcessingIcon.innerHTML = `Preparing <i id="main-dish-statusIcon1" class="fas fa-sync-alt"></i>`;
          processingIcon.appendChild(newProcessingIcon);
          break;

        case "complete":
          let readyIcon = document.getElementById("main-dish-processing");
          let newReadyIcon = document.createElement("div");
          newReadyIcon.innerHTML = `<span id="readyText">Ready!</span>  <i id="main-dish-statusIcon2" class="fas fa-check-circle"></i>`;
          readyIcon.appendChild(newReadyIcon);
          break;
      }

      mainDishCounter++;
    } else if (each_obj.type == "appetizer") {
      //check appetizer type
      let orderedAppetizerItem = document.getElementById(
        "ordered-appetizer-item"
      );
      let newAppetizerItem = document.createElement("div");
      newAppetizerItem.textContent = each_obj.food_name;
      orderedAppetizerItem.appendChild(newAppetizerItem);

      //check appetizer quantity
      let orderedAppetizerQuantity = document.getElementById(
        "ordered-appetizer-quantity"
      );
      let newOrderedAppetizerQuantity = document.createElement("div");
      newOrderedAppetizerQuantity.textContent = each_obj.quantity;
      orderedAppetizerQuantity.appendChild(newOrderedAppetizerQuantity);

      //check status
      switch (each_obj.status) {
        case "cooking":
          let processingIcon = document.getElementById("appetizer-processing");
          let newProcessingIcon = document.createElement("div");
          newProcessingIcon.innerHTML = `Preparing <i id="appetizer-statusIcon1" class="fas fa-sync-alt"></i>`;
          processingIcon.appendChild(newProcessingIcon);
          break;

        case "complete":
          let readyIcon = document.getElementById("appetizer-processing");
          let newReadyIcon = document.createElement("div");
          newReadyIcon.innerHTML = `<span id="readyText">Ready!</span> <i id="appetizer-statusIcon2" class="fas fa-check-circle"></i>`;
          readyIcon.appendChild(newReadyIcon);
          break;
      }

        appetizerCounter++;
    } else if (each_obj.type == "side") {
      //check side dish type
      let orderedSideDishItem = document.getElementById(
        "ordered-side-dish-item"
      );
      let newSideDishItem = document.createElement("div");
      newSideDishItem.textContent = each_obj.food_name;
      orderedSideDishItem.appendChild(newSideDishItem);

      //check side dish quantity
      let orderedSideDishQuantity = document.getElementById(
        "ordered-side-dish-quantity"
      );
      let newOrderedSideDishQuantity = document.createElement("div");
      newOrderedSideDishQuantity.textContent = each_obj.quantity;
      orderedSideDishQuantity.appendChild(newOrderedSideDishQuantity);

      //check status
      switch (each_obj.status) {
        case "cooking":
          let processingIcon = document.getElementById("side-dish-processing");
          let newProcessingIcon = document.createElement("div");
          newProcessingIcon.innerHTML = `Preparing <i id="side-dish-statusIcon1" class="fas fa-sync-alt"></i>`;
          processingIcon.appendChild(newProcessingIcon);
          break;

        case "complete":
          let readyIcon = document.getElementById("side-dish-processing");
          let newReadyIcon = document.createElement("div");
          newReadyIcon.innerHTML = `<span id="readyText">Ready!</span> <i id="side-dish-statusIcon2" class="fas fa-check-circle"></i>`;
          readyIcon.appendChild(newReadyIcon);
          break;
      }

      sideDishCounter++;
    } else if (each_obj.type == "drink") {
      //check drink type
      let orderedDrinkItem = document.getElementById("ordered-drink-item");
      let newDrinkItem = document.createElement("div");
      newDrinkItem.textContent = each_obj.food_name;
      orderedDrinkItem.appendChild(newDrinkItem);

      //check drink quantity
      let orderedDrinkQuantity = document.getElementById(
        "ordered-drink-quantity"
      );
      let newOrderedDrinkQuantity = document.createElement("div");
      newOrderedDrinkQuantity.textContent = each_obj.quantity;
      orderedDrinkQuantity.appendChild(newOrderedDrinkQuantity);

      //check status
      switch (each_obj.status) {
        case "cooking":
          let processingIcon = document.getElementById("drink-processing");
          let newProcessingIcon = document.createElement("div");
          newProcessingIcon.innerHTML = `Preparing <i id="drink-statusIcon1" class="fas fa-sync-alt"></i>`;
          processingIcon.appendChild(newProcessingIcon);
          break;

        case "complete":
          let readyIcon = document.getElementById("drink-processing");
          let newReadyIcon = document.createElement("div");
          newReadyIcon.innerHTML = `<span id="readyText">Ready!</span> <i id="drink-statusIcon2" class="fas fa-check-circle"></i>`;
          readyIcon.appendChild(newReadyIcon);
          break;
      }

      drinkCounter++;
    }
  }

  if (appetizerCounter > 0) {
    document.getElementById("appetizer-container").classList.remove("hidden");
  } else {
    document.getElementById("appetizer-container").classList.add("hidden");
  }

  if (mainDishCounter > 0) {
    document.getElementById("main-dish-container").classList.remove("hidden");
  } else {
    document.getElementById("main-dish-container").classList.add("hidden");
  }

  if (sideDishCounter > 0) {
    document.getElementById("side-dish-container").classList.remove("hidden");
  } else {
    document.getElementById("side-dish-container").classList.add("hidden");
  }

  if (dessertCounter > 0) {
    document.getElementById("dessert-container").classList.remove("hidden");
  } else {
    document.getElementById("dessert-container").classList.add("hidden");
  }

  if (drinkCounter > 0) {
    document.getElementById("drink-container").classList.remove("hidden");
  } else {
    document.getElementById("drink-container").classList.add("hidden");
  }
};

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

window.onload = async () => {
  await customerSeatId();
  await orderedList();
};

socket.on("updateStatus", () =>{
  //orderedList()
  location.reload();

})
