/**
 * server.js
 * main file of the rpgserver
 */

const net = require('net'),
    dice = require('./dice.js'),
    config = require('./config.json'),
    conn = require('./connection.js')

let connections = []

const server = net.createServer((c) => {
    console.log("Client connected");
    connections.push(new conn(c))
    c.on('data', (data) => {
        let message = JSON.parse(spliceData(data.toString())[0])
        messageHandler(message, c)
    })
    c.on('end', () => {
        connections.splice(
            connections.indexOf(
                connections.filter((el) => { 
                    return el.connection() === c 
                })[0]
            )
        )
    })
    c.on('error', (e) => { 
        connections.splice(
            connections.indexOf(
                connections.filter((el) => { 
                    return el.connection() === c 
                })[0]
            )
        )
        console.log("Clienterror:")
        console.log(e)
        c.end()
    })
})

server.on('error', (e) => {
    console.log("Servererror:")
    console.log(e)
})

server.listen(config.server.port, () => {
    console.log("Server started.")
})

function messageHandler(data, con) {
    switch(data.type) {
        case "player":
            //message is string, origin is player
            conWrite(data)
        break;
        case "system":
            //message is object, origin is system/player
            if(typeof data.message !== "object") {
                return null
            } else {
                switch(data.message.function) {
                    case "handshake": //handshake
                        name = data.message.arguments[0] || "User" + Math.floor(Math.random * 10000)
                        connections.filter((el) => {
                            return el.connection() === con
                        })[0].name(name)
                        conWrite({
                            origin: "system",
                            type: "system",
                            message: name + " hat sich verbunden."
                        })
                    break;
                    case "name": //TODO: origin and name ... kinda redundant
                        connections.filter((el) => {
                            return el.connection() === con
                        })[0].name(data.message.arguments[0])
                        conWrite({
                            origin: "system",
                            type: "system",
                            message: data.origin + " hei&szlig;t jetzt: " + data.message.arguments[0]
                        })
                    break;
                    case "dice":
                        let x = dice(data.message.arguments[0], data.message.arguments[1])
                        conWrite({
                                origin: "system",
                                type: "system",
                                message: data.origin + " hat gew&uuml;rfelt: " + x.results
                        })
                    break;
                    default:
                    return null
                    break;
                }
            }
        break;
        default:
        break;
    }
}

function conWrite(data) {
    data = JSON.stringify(data) + "|||"
    for(var i = 0; i < connections.length; i++) {
        connections[i].connection().write(data)
        connections[i].connection().pipe(connections[i].connection())
    }
}

function spliceData(str) {
    return str.split("|||")
}