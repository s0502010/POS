async function customerInfo() {
    const res = await fetch('/customerInfo')
    const result = await res.json();
    console.log(result) 

    document.querySelector('#user-name').textContent = result[0].name
    document.querySelector('#mobile').textContent = result[0].mobile
    document.querySelector('#birthday').textContent = moment(result[0].date_of_birth).format("MMM Do YY")
    document.querySelector('#gender').textContent = result[0].gender
}

customerInfo();


