
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
        showdown.ws.send(showdown.room + "|/inactive")
        if (p1 !== '') {
            const result = testAddon.startPoint(showdown.state);
            if (result !== '') {
                showdown.ws.send(showdown.room + testAddon.startPoint(p1));
            }

        }
    })

    showdown.on("forceSwitch", (data) => {

        let stateObj = JSON.parse(data);
        let aliveMons = [];
        for (let x of stateObj.side.pokemon) {
            if (x.condition !== "0 fnt") {
                aliveMons.push(x);
            }
        }
        showdown.ws.send(showdown.room + "|/switch " + aliveMons[Math.floor(Math.random() * aliveMons.length)].ident.slice(4));
    })

    showdown.on("error", () => {
        const result = testAddon.startPoint(showdown.state);
        if (result !== '') {
            showdown.ws.send(showdown.room + testAddon.startPoint(showdown.state));
        }
    })


    showdown.on("faint", (pkmn) => {
        console.log("fainted my mon");
    })

    showdown.on("win", () => {
        showdown.search("gen8randombattle");
    })

    showdown.on("loss", () => {
        showdown.search("gen8randombattle");
    })

}
