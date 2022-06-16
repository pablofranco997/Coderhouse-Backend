const socket = io.connect();

function renderChat(data) {
    const html = data.map(elem => {
    return(
        `<div style="color:brown">
                <strong style="color:blue">${elem.author.nombre}</strong>
                :
                <em style="color:green">${elem.text}</em>
            </div>`
            )
    }).join(" ");
    document.getElementById('messages').innerHTML = html;
}

function addMessage(e) {
    const mensaje = {
        nombre: document.getElementById('nombre').value,
        id: document.getElementById('id').value,
        apellido: document.getElementById('apellido').value,
        edad: document.getElementById('edad').value,
        alias: document.getElementById('alias').value,
        texto:  document.getElementById('texto').value
    };
    socket.emit('new-message', mensaje);
    return false;
}

socket.on('messages', async data => {
    renderChat(await data);
})
