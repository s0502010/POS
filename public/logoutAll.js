const logoutbutton = document.querySelector('#logout');
logoutbutton.addEventListener('click', async (event) => {
    event.preventDefault();
    const res = await fetch('/logout')
    const result = await res.json();
    if (result.success == true) {
        window.location = '/';
    }
})