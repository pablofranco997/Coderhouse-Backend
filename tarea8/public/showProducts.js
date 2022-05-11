const socket = io.connect();

async function renderProducts(data) {
    const html = data.map((elem, index) => {
        return(`<tr>
                    <th>${elem.id}</th>
                    <th>${elem.name}</th>
                    <th>${elem.price}</th> 
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
socket.on('products', async data => {
    renderProducts(await data);
})