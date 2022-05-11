const socket = io.connect();

function renderChat(data) {
    const html = data.map((elem, index) => {
    return(`<div style="color:brown">
                <strong style="color:blue">${elem.name}</strong>
                ${elem.time}
                :
                <em style="color:green">${elem.message}</em>
            </div>`)
    }).join(" ");
    document.getElementById('messages').innerHTML = html;
}

function addMessage(e) {
    const mensaje = {
        name: document.getElementById('username').value,
        message: document.getElementById('texto').value
    };
    socket.emit('new-message', mensaje);
    return false;
}

socket.on('messages', async data => {
    renderChat(await data);
})
