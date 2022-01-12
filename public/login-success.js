const socket = io.connect();
// const tableNumber = document.querySelector("#seatNumber")

// const button = document.querySelector("#sendSeatNumber");
// button.addEventListener("click",async()=>{
//     console.log("clicked" , tableNumber.value)
//     socket.emit("receive_seat_id", {SeatId :tableNumber.value});
// });

// const socket = io.connect();

// https://www.the-qrcode-generator.com/ <---this is the QR code generator 

        async function onScanSuccess(decodedText, decodedResult) {
        // handle the scanned code as you like, for example:
        console.log(`Code matched = ${decodedText}`, decodedResult);

        // var sliced_result = decodedText.slice(1,-1);
        // console.log(sliced_result)

        // let a = JSON.parse(sliced_result)
        // console.log(a.SeatNo)

        // console.log(JSON.parse(decodedText).SeatNo)
        // console.log(decodedResult)

        console.log(JSON.parse(decodedText).SeatNo)
        let SeatId = JSON.parse(decodedText)


        // console.log(decodedResult)


        // console.log(decodedText)
        // let a = await decodedResult.decodedText
        // console.log('a:', a);
        // console.log('typeof a:', typeof a);

        // let b = await JSON.parse(a)
        // console.log('b :', b)

        socket.emit("receive_seat_id", {SeatId :SeatId.SeatNo});

        window.location = `/c-menu.html?table=${SeatId.SeatNo}`
        
        }

        function onScanFailure(error) {
        // handle scan failure, usually better to ignore and keep scanning.
        // for example:
        console.warn(`Code scan error = ${error}`);
        }

        let html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: {width: 250, height: 250} },
        /* verbose= */ false);
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);