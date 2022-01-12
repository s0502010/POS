let categoryList = [];
let typeList = [];
let itemList;
let foodList = []

async function loadMenu() {
    const menuType = await fetch("/Menu/Type");
    const menuTypeLists = await menuType.json();

    for (let menuTypeList of menuTypeLists) {
        typeList.push(menuTypeList.type);
        addingCategoryHTML(menuTypeList.type)
    }
    // adding to left HTML
    // for (let typeName of typeList) {
    //     addingCategoryHTML(typeName);
    // }

    const menuItem = await fetch("/Menu/Item");
    const menuItemLists = await menuItem.json();

    itemList = menuItemLists;

    for (let item of itemList) {
        addingItemHTML(item.type, item.name, item.price, item.id);
        foodList.push(item)
        // itemLists.push({ type: item.type, name: item.name, price: item.price });
    }

    console.log(itemList);

    insertCategoryBTN(typeList);
    editMenuTypeBTN();
    editItemTypeBTN();
}
loadMenu();

console.log(foodList)

async function addingCategory() {
    // left area of category
    await Swal.fire({
        title: "Adding Category",
        html: `
        <label>Name of Category:</label>
        <input id="input" class="swal2-input">
        `,
        showDenyButton: true,
        // showCancelButton: true,
        confirmButtonText: "Save",
        // denyButtonText: `Don't save`,
    }).then((result) => {
        let inputNameOfCategory = document.querySelector("#input").value;

        if (result.isConfirmed && inputNameOfCategory) {
            Swal.fire("Save!", "Your file has been saved.", "success");
            addingCategoryHTML(inputNameOfCategory);
            typeSubmitInCategoryTransfer(inputNameOfCategory);

            typeList.push(inputNameOfCategory);

            insertCategoryBTN(typeList);
            
        } else if (result.isConfirmed && !inputNameOfCategory) {
            Swal.fire(`Invalid Input!`);
            return;
        }

        editMenuTypeBTN();
    });

    // insertCategoryBTN(typeList)
}

//adding item on right
async function addingCategoryItem(nameOfCategory) {
    await Swal.fire({
        title: `Adding ${nameOfCategory}`,
        html: `
            <div class='insert${nameOfCategory}'>
        <form id="${nameOfCategory}-form">
            <div class='a'>
            <label>Name:</label>
            <input id="nameOf${nameOfCategory}Input" class="swal2-input" type='text' name="name">
            <br>
            <label>Price:</label>
            <input id="priceOf${nameOfCategory}Input" class="swal2-input" type='number' name="price">
            <br>
            <label>Description:</label>
            <input id="descriptionOf${nameOfCategory}Input" class="swal2-input" type='text' name="des">
            <br>
            <label>Status:
            <input id="statusOf${nameOfCategory}Input" class="swal2-input" type='text' name="status">
            </label>

            <br>
            <label>Image File:
            <br>
            <input type="file" id='${nameOfCategory}image' name="photo">
            </label>   
            
            <br>
                <div>
                <input type='reset' value="Clear"/>
                </div>
            </div>
        </form>
        </div>
        `,
        showDenyButton: true,
        confirmButtonText: "Save",
        preConfirm: () => {
            return [document.getElementById(`${nameOfCategory}-form`)];
        },
    }).then((result) => {
        const nameOfItem = document.querySelector(`#nameOf${nameOfCategory}Input`).value;
        // const imageOfItem = document.querySelector(`#${nameOfCategory}image`).value
        const priceOfItem = document.querySelector(`#priceOf${nameOfCategory}Input`).value;
        // const descriptionOfItem = document.querySelector(`#descriptionOf${nameOfCategory}Input`).value
        // const statusOfItem = document.querySelector(`#statusOf${nameOfCategory}Input`).value
        const typeOfItem = nameOfCategory;

        if (result.isConfirmed && nameOfItem && priceOfItem) {

            itemList = itemInMenuTransfer(result.value[0], typeOfItem);

        } else if (result.isConfirmed && (!nameOfItem || !priceOfItem)) {
            Swal.fire(`Invalid Input!`);
            return;
        }
    });

    insertCategoryBTN(typeList);
}

document.getElementById("insertCategoryBtn").addEventListener("click", async () => {
    addingCategory();
});

async function insertCategoryBTN(typeList) {
    console.log(typeList)
    if (typeList.length != 0) {
        for (let nameOfCategory of typeList) {
            document.getElementById(`insert${nameOfCategory}Btn`).addEventListener("click", async () => {
                console.log(nameOfCategory);
                addingCategoryItem(nameOfCategory);

                editItemTypeBTN()
            })
        }
    }
}

function addingCategoryHTML(inputNameOfCategory) {

    // left area of type
    document.querySelector("#category-area").innerHTML += `
            <span id='${inputNameOfCategory}-item'>
            <a href="#${inputNameOfCategory}" class="w3-bar-item w3-button w3-hover-white" id="item">${inputNameOfCategory}
            <span class='w3-hover-blue'><i class="fas fa-ellipsis-v" id="${inputNameOfCategory}-edit-type-btn"></i></span>
            </a>
            
            </span>
            `;

    // right area of items
    document.querySelector("#Name-of-Category").innerHTML += `
            <div class="w3-container" id="${inputNameOfCategory}" style="margin-top:75px">
                    <h1 class="w3-xxlarge w3-text-green"><b>${inputNameOfCategory}</b></h1>
                    <hr style="border:5px solid green" class="w3-round">
                    <div class="w3-bar-block">
                    <div class='${inputNameOfCategory}-area'>
                        <div class='${inputNameOfCategory}-inside-item'>
                        </div>
                        </div>
                    </div>
                    </div>
            `;
    // right area of insert
    document.querySelector(`.${inputNameOfCategory}-area`).innerHTML += `
            <a id="insert${inputNameOfCategory}Btn" class="w3-bar-item w3-button w3-hover-green">+ Insert ${inputNameOfCategory}</a>
            `;
}

async function addingItemHTML(type, name, price, id) {
    document.querySelector(`.${type}-inside-item`).innerHTML += `
    <div id="item-${id}" class="${name}-in-${type}">
    <a  class="w3-bar-item w3-button w3-hover-green" id="item">${name}
                            <span>$ ${price}</span>
                            <span><span class='w3-hover-blue'><i class="fas fa-ellipsis-v" id="EditItemBTN${id}"></i></span></span>
                        </a>`;
}

async function typeSubmitInCategoryTransfer(typeOfCategory) {
    let categoryName = {
        categoryType: typeOfCategory,
    };
    const res = await fetch("/typeSubmitInCategory", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryName),
    });
    const result = await res.json();

}

async function itemInMenuTransfer(data, typeOfItem) {

    let submitData = new FormData();

    submitData.append("itemName", data.name.value);
    submitData.append("itemPrice", data.price.value);
    submitData.append("itemDescription", data.des.value);
    submitData.append("itemStatus", data.status.value);
    submitData.append("image", data.photo.files[0]);
    submitData.append("itemType", typeOfItem);

    const res = await fetch("/itemSubmitInMenu", {
        method: "POST",
        body: submitData,
    });

    const result = await res.json();

    itemList = result

    for (let result of itemList) {
        if (data.name.value == result.name) {
            addingItemHTML(result.type, result.name, result.price, result.id);
        }
    }

    editItemTypeBTN()
}

// edit type button
async function editMenuTypeBTN() {
    // return
    for (let type of typeList) {
        document.querySelector(`#${type}-edit-type-btn`).addEventListener("click", async () => {
            await Swal.fire({
                title: "Edit Category",
                html: `
                <label>Name of Category:</label>
                <input id="input" class="swal2-input">
                `,
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Save",
                denyButtonText: `Delete`,
            }).then((result) => {
                let inputNameOfCategory = document.querySelector("#input").value;
                if (result.isConfirmed && inputNameOfCategory) {
                    Swal.fire("Save!", "Your file has been saved.", "success");

                    document.querySelector(`#${type}-item`).outerHTML = `
                    <span id='${inputNameOfCategory}-item'>
                    <a href="#${inputNameOfCategory}" class="w3-bar-item w3-button w3-hover-white" id="item">${inputNameOfCategory}
                    <span class='w3-hover-blue'><i class="fas fa-ellipsis-v" id="${inputNameOfCategory}-edit-type-btn"></i></span>
                    </a>
                    </span>
                    `;

                    // right area of items
                    document.querySelector(`#${type}`).outerHTML = `
                    <div class="w3-container" id="${inputNameOfCategory}" style="margin-top:75px">
                            <h1 class="w3-xxlarge w3-text-green"><b>${inputNameOfCategory}</b></h1>
                            <hr style="border:5px solid green" class="w3-round">
                            <div class="w3-bar-block">
                            <div class='${inputNameOfCategory}-area'>
                                <div class='${inputNameOfCategory}-inside-item'>
                                </div>
                                </div>
                            </div>
                            </div>
                    `;
                    typeList[typeList.indexOf(type)] = inputNameOfCategory;
                    for (let item of itemList) {
                        if (item.type == type) {
                            item.type = inputNameOfCategory;
                        }
                    }
                    let node = document.createElement("div");
                    node.setAttribute("class", `${inputNameOfCategory}-inside-item`);
                    document.querySelector(`.${inputNameOfCategory}-area`).appendChild(node);
                    for (let item of itemList) {
                        if (item.type == inputNameOfCategory) {
                            addingItemHTML(item.type, item.name, item.price, item.id);
                        }
                    }

                    // update to database
                    typeChangeInCategoryTransfer(inputNameOfCategory, type);

                    // right area of insert
                    document.querySelector(`.${inputNameOfCategory}-area`).innerHTML += `
                    <a id="insert${inputNameOfCategory}Btn" class="w3-bar-item w3-button w3-hover-green">+ Insert ${inputNameOfCategory}</a>
                    `
                } else if (result.isConfirmed && !inputNameOfCategory) {
                    Swal.fire(`Invalid Input!`);
                    return;
                } else if (result.isDenied) {
                    console.log('delete')
                    console.log(type);



                    document.querySelector(`#${type}-item`).remove()
                    document.querySelector(`#${type}`).remove();
                    deleteCategory(type)
                    // deleteCategory(nameOfCategory)
                }
                // insertCategoryBTN(typeList);
                // editMenuTypeBTN();
            });
        });

    }
}

async function deleteCategory(type) {
    let categoryList = { type: type };
    console.log(categoryList)
    const res = await fetch("/deleteCategory", {
        method: "Delete",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryList),
    });
    const result = await res.json()

    typeList = []

    for(let i of result) {
        typeList.push(i.type)
    }
    console.log(typeList)
}
console.log(typeList)
// update to database
async function typeChangeInCategoryTransfer(updateCategory, originCategory) {
    let categoryList = {
        updateType: updateCategory,
        originType: originCategory,
    };
    const res = await fetch("/updateCategory", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryList),
    });

    const result = await res.json();

    itemList = result

    console.log(itemList)

    for (let result of itemList) {
        if (updateCategory != originCategory) {


            let menuItem = document.querySelector(`#item-${result.id}`)
            menuItem.remove();

            addingItemHTML(result.type, result.name, result.price, result.id)
        }
    }
    editItemTypeBTN()
}

async function editItemTypeBTN() {
    for (let nameOfCategory of itemList) {
        document.querySelector(`#EditItemBTN${nameOfCategory.id}`).addEventListener("click", async () => {
            await Swal.fire({
                title: `edit ${nameOfCategory.name}`,
                html: `
                        <div class='insert${nameOfCategory.name}'>
                    <form id="${nameOfCategory.name}-form">
                        <div class='a'>
                        <label>Name:</label>
                        <input id="nameOf${nameOfCategory.name}Input" class="swal2-input" type='text' name="name" value="${nameOfCategory.name}">
                        <br>
                        <label>Price:</label>
                        <input id="priceOf${nameOfCategory.name}Input" class="swal2-input" type='number' name="price" value="${nameOfCategory.price}">
                        <br>
                        <label>Description:</label>
                        <input id="descriptionOf${nameOfCategory.name}Input" class="swal2-input" type='text' name="des" value="${nameOfCategory.description}">
                        <br>
                        <label>Status:
                        <input id="statusOf${nameOfCategory.name}Input" class="swal2-input" type='text' name="status" value="${nameOfCategory.status}">
                        </label>
            
                        <br>
                        <label>Image File:
                        <br>
                        <input type="file" id='${nameOfCategory.name}image' name="photo">
                        </label>       
                        </div>
                    </form>
                    </div>
                    `,
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Save",
                denyButtonText: `Delete`,
                preConfirm: () => {
                    return [document.getElementById(`${nameOfCategory.name}-form`)];
                },
            }).then((result) => {
                const updateNameOfItem = document.querySelector(`#nameOf${nameOfCategory.name}Input`).value;
                const updatePriceOfItem = document.querySelector(`#priceOf${nameOfCategory.name}Input`).value;
                const typeOfItem = nameOfCategory.type;
                let itemId = nameOfCategory.id

                if (result.isConfirmed && updateNameOfItem && updatePriceOfItem) {
                    updateItem(result.value[0], typeOfItem, nameOfCategory)

                    document.querySelector(`.${nameOfCategory.name}-in-${typeOfItem}`).outerHTML = `
                          <div id="item-${nameOfCategory.id}" class="${updateNameOfItem}-in-${typeOfItem}">
                        <a  class="w3-bar-item w3-button w3-hover-green" id="item">${updateNameOfItem}
                            <span>$ ${updatePriceOfItem}</span>
                            <span><span class='w3-hover-blue'><i class="fas fa-ellipsis-v" id="EditItemBTN${nameOfCategory.id}"></i></span></span>
                        </a>
                        </div>
                        `;

                    getItemInMenu()

                } else if (result.isDenied) {
                    let menuItem = document.querySelector(`#item-${nameOfCategory.id}`)
                    menuItem.remove();
                    console.log(nameOfCategory)

                    deleteItem(nameOfCategory)

                } else if (result.isConfirmed && (!nameOfItem || !priceOfItem)) {
                    Swal.fire(`Invalid Input!`);
                    return;
                }

            })
        });
    }
}

async function getItemInMenu() {
    const menuItem = await fetch("/Menu/Item");
    const menuItemLists = await menuItem.json();
    itemList = menuItemLists;
    editItemTypeBTN()
}

async function updateItem(data, typeOfItem, originItem) {

    let submitData = new FormData();

    submitData.append("itemName", data.name.value);
    submitData.append("itemPrice", data.price.value);
    submitData.append("itemDescription", data.des.value);
    submitData.append("itemStatus", data.status.value);
    submitData.append("image", data.photo.files[0]);
    submitData.append("itemType", typeOfItem);
    submitData.append("originItemId", originItem.id);

    const res = await fetch("/updateItem", {
        method: "PUT",
        body: submitData
    });

    const result = await res.json();
}

async function deleteItem(menuItem) {
    let categoryList = menuItem;
    const res = await fetch("/deleteItem", {
        method: "Delete",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryList),
    });
}
