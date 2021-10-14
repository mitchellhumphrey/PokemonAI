
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import axios from 'axios';
import { WebSocket } from 'ws';
import parser from './parser.js';

import dotenv from 'dotenv';
dotenv.config()
const testAddon = require('../build/Release/testaddon.node');

export default async () => {
    // console.log('addon', testAddon);
    // console.log(testAddon.hello())
    // console.log(testAddon.add(5, 10))

    const showdownConnection = new WebSocket("ws://sim.smogon.com:8000/showdown/websocket");
    const chatParser = new parser(showdownConnection);

    showdownConnection.onmessage = async (event) => {
        let message = ""
        for (let x of event.data) {

            if (x !== '|') {
                message += x;
            }
            else {
                if (message.includes("challstr")) {
                    console.log("cha")
                    if (message.match('\|').length > 2) {
                        message = "";
                    }
                    else {
                        message += x;
                    }
                }
                else {
                    console.log(message);
                    message = ""
                }

            }
        }
        console.log("finished");
        console.log(message);
        if (message.includes("challstr")) {
            let response = await axios.post("https://play.pokemonshowdown.com/action.php",
                {
                    "act": "login",
                    "name": process.env.SHOWDOWN_USERNAME,
                    "pass": process.env.SHOWDOWN_PASSWORD,
                    "challstr": message.slice(9)
                }
            )


            showdownConnection.send(`|/trn PotatoBotAI,0,${JSON.parse(response.data.slice(1)).assertion}`, (err) => {
                if (err) console.error(err);
                else {
                    console.log("logged in")
                }
            });
        }
    }

    showdownConnection.onopen = async () => {
        console.log("Websocket is open!");


    }
}
