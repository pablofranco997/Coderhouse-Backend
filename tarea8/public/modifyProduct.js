const socket = io.connect();

async function renderModifyProducts(data) {
    console.log(data + " render_prueba")
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
function modifyProducts(e) {
    const modifiedproduct = {
        id: document.getElementById('_id').value,
        name: document.getElementById('nombre').value,
        price: document.getElementById('precio').value
    };
    socket.emit('modify-product', modifiedproduct);
    return false;
}

//showProducts
socket.on('modifyProducts', async data => {
    console.log(await data)
    renderModifyProducts(data);
})