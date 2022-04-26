const socket = io.connect();

function renderAddProducts(data) {
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
function addProducts(e) {
    const newproduct = {
        id: document.getElementById('_id').value,
        nombre: document.getElementById('nombre').value,
        precio: document.getElementById('precio').value
    };
    socket.emit('add-products', newproduct);
    return false;
}

//showProducts
socket.on('addProducts', data => {
    
    renderAddProducts(data);
})