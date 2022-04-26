const socket = io.connect();

function renderProducts(data) {
    const html = data.map((elem, index) => {
        return(`<tr>
                    <th>${elem.id}</th>
                    <th>${elem.nombre}</th>
                    <th>${elem.precio}</th> 
                </tr>   `)
    }).join(" ");

    document.getElementById('products').innerHTML = html;
}

// showProducts
function showProducts(e) {
    const product = {
        id: document.getElementById('productID').value,
    };
    socket.emit('show-products', product);
    return false;
}

//showProducts
socket.on('products', data => {
    renderProducts(data);
})