const {ipcRenderer} = require('electron'),
    net = require('net')

var serverCon
let chatbutton, chattext, chatwindow

window.onload = () => {
    serverCon = new net.Socket()
    chatbutton = document.getElementById('chattextbutton'),
        chattext = document.getElementById('chattext'),
        chatwindow = document.getElementById('chatwindow')

    chatbutton.addEventListener('click', () => {
        //send the text
        messageHandler(chattext.value)
        chattext.value = ""
    })
    chattext.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') { //send the text
            messageHandler(chattext.value)
            chattext.value = ""
        }
    })
    serverCon.on('data', (data) => {
        let message = JSON.parse(data.toString().split("|||")[0].split("\r\n")[0]),
            row = document.createElement('tr'),
            columnLeft = document.createElement('td'),
            columnRight = document.createElement('td')
        if(message.type === "system") {
            row.appendChild(columnLeft)
            columnRight.innerHTML = message.message
            row.appendChild(columnRight)
            chatwindow.children.item(0).appendChild(row)
        } else if (message.type === "player") {
            columnLeft.innerHTML = message.origin
            columnRight.innerHTML = message.message
            row.appendChild(columnLeft)
            row.appendChild(columnRight)
            chatwindow.children.item(0).appendChild(row)
        }
    })
};

function messageHandler(message) {
    a = message
    //no Connection to server
    if(a.startsWith('.server') || a.startsWith('/server')) {
        console.log("test")
        let command = a.split(' ')
        playername = command[3]
        serverCon.connect(command[2], command[1])
        serverCon.write(JSON.stringify({
            origin: playername,
            type: "system",
            message: {
                function: "handshake",
                arguments: [playername]
            }
        })+ "|||")
    }
    // Connection to server
    if(a.startsWith('.') || a.startsWith('/')) { //system calls
        let command = a.slice(1)
        switch(command.split(" ")[0]) {
            case "dice":
                var dice = command.split(" "),
                    sides = dice[2],
                    number = dice[1]
                serverCon.write(JSON.stringify({
                    origin: playername,
                    type: "system",
                    message: {
                        function: "dice",
                        arguments: [sides, number]
                    }
                })+ "|||")
            break;
            case "throwdice":
                var dice = command.split(" "),
                    sides = dice[2],
                    number = dice[1]
                serverCon.write(JSON.stringify({
                    origin: playername,
                    type: "system",
                    message: {
                        function: "dice",
                        arguments: [sides, number]
                    }
                })+ "|||")
            break;
            default:
            break;
        }
    } else { //non-system
        serverCon.write(JSON.stringify({
            origin: playername,
            type: "player",
            message: a
        }) + "|||") 
    }
}