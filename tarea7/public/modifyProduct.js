const socket = io.connect();

function renderModifyProducts(data) {
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
function modifyProducts(e) {
    const modifiedproduct = {
        id: document.getElementById('_id').value,
        nombre: document.getElementById('nombre').value,
        precio: document.getElementById('precio').value
    };
    socket.emit('modify-product', modifiedproduct);
    return false;
}

//showProducts
socket.on('modifyProducts', data => {
    renderModifyProducts(data);
})