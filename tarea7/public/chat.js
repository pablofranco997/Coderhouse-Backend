const socket = io.connect();

function renderChat(data) {
    const html = data.map((elem, index) => {
    return(`<div style="color:brown">
                <strong style="color:blue">${elem.author}</strong>
                ${elem.date}
                :
                <em style="color:green">${elem.text}</em>
            </div>`)
    }).join(" ");
    document.getElementById('messages').innerHTML = html;
}

function addMessage(e) {
    const mensaje = {
        author: document.getElementById('username').value,
        text: document.getElementById('texto').value
    };
    socket.emit('new-message', mensaje);
    return false;
}

socket.on('messages', data => {
    renderChat(data);
})
