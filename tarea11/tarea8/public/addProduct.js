const socket = io.connect();

function renderAddProducts(data) {
    const html = data.map(elem => {
        return(`<tr>
                    <th>${elem.id}</th>
                    <th>${elem.name}</th>
                    <th>${elem.price}</th> 
                </tr>   `)
    }).join(" ");
    document.getElementById('products').innerHTML = html;
}

// showProducts
function addProducts(e) {
    const newproduct = {
        id: document.getElementById('_id').value,
        name: document.getElementById('nombre').value,
        price: document.getElementById('precio').value
    };
    socket.emit('add-products', newproduct);
    return false;
}

//showProducts
socket.on('addProducts', async data => {
    renderAddProducts(await data);
})