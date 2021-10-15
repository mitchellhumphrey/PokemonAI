
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import { WebSocket } from 'ws';
import showdownManager from './showdownManager.js';

import dotenv from 'dotenv';
dotenv.config()
const testAddon = require('../build/Release/testaddon.node');

export default async () => {
    console.log('addon', testAddon);
    // console.log(testAddon.hello())
    // console.log(testAddon.add(5, 10))

    const showdownConnection = new WebSocket("ws://sim.smogon.com:8000/showdown/websocket");
    const showdown = new showdownManager(showdownConnection);

    showdown.on("logged in", () => {
        console.log("logged in")
        // showdown.challenge("PotatoBotAI", "gen8randombattle")
        showdown.search("gen8randombattle");
    })

    showdown.on("request", (p1) => {
        console.log("REQUEST EMITTER");
        if (p1 !== '') {
            // let choice = 
            // console.log(choice);
            const result = testAddon.startPoint(p1);
            if (result !== '') {
                showdown.ws.send(showdown.room + testAddon.startPoint(p1));
            }

        }
    })
    showdown.on("faint", (pkmn) => {
        showdown.ws.send(showdown.room + "|/request")
    })
}
