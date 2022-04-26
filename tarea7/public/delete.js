const socket = io.connect();

function renderDeleteProducts(data) {
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
function deleteProducts(e) {
    const toDeleteproduct = {
        id: document.getElementById('_id').value,
        confirmation: document.getElementById('confirmation').value
    };

    socket.emit('delete-product', toDeleteproduct);
    return false;
}

//showProducts
socket.on('deleteProducts', data => {
    renderDeleteProducts(data);
})