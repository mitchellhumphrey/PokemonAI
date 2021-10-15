import { EventEmitter } from 'events';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config()

class messageWithParams {
    constructor(message, parameters = []) {
        this.command = message;
        this.parameters = parameters;
    }
};

export default class showdownManager extends EventEmitter {
    constructor(ws) {
        super();
        this.ws = ws
        this.room = '';

        this.on('challstr', async (challstr) => {
            console.log("verifying login")
            let response = await axios.post("https://play.pokemonshowdown.com/action.php",
                {
                    "act": "login",
                    "name": process.env.SHOWDOWN_USERNAME,
                    "pass": process.env.SHOWDOWN_PASSWORD,
                    "challstr": challstr
                }
            )
            ws.send(`|/trn ${process.env.SHOWDOWN_USERNAME},0,${JSON.parse(response.data.slice(1)).assertion}`, (err) => {
                if (err) console.error(err);
                else {
                    this.emit("logged in");
                }
            });
        })

        this.ws.onmessage = async (event) => {
            console.log(event.data);
            let commands = [];
            let message = "";
            let parameters = 0;
            let tempParameters = [];
            let tempCommand = "";
            let roomFlag = false;

            for (let x of event.data) {

                if (x !== '|' && x !== '>' && !roomFlag) {
                    if (x !== '\n') {
                        message += x;
                    }

                }
                else if (x === '>') {
                    this.room = "";
                    roomFlag = true;
                }
                else if (roomFlag) {
                    if (x !== '\n') {
                        this.room += x
                    }
                    else {
                        roomFlag = false;
                    }

                }
                else {
                    if (parameters === 0) {
                        if (message === "challstr") {
                            parameters = 2;
                            tempCommand = "challstr";
                        }
                        else if (message === "request") {
                            parameters = 1;
                            tempCommand = "request";
                        }
                        message = "";
                    }
                    else {
                        tempParameters.push(message);
                        message = ""


                        if (parameters === 0) {
                            commands.push(new messageWithParams(tempCommand, tempParameters));
                            tempParameters = [];
                            tempCommand = "";
                        }
                        parameters -= 1;
                    }

                }
            }
            if (parameters !== 0) {
                tempParameters.push(message);
                commands.push(new messageWithParams(tempCommand, tempParameters));
            }
            else {
                commands.push(new messageWithParams(message));
            }

            for (let x of commands) {
                console.log(x)
                console.log(this.room)
                if (x.command === "challstr") {
                    this.emit("challstr", x.parameters[0] + '|' + x.parameters[1]);
                }
                else if (x.command === "request") {
                    this.emit("request", x.parameters[0]);
                }
                else if (x.command === "faint") {
                    this.emit("faint");
                }
            }


        }

        this.challenge = (username, format) => {
            this.ws.send(`|/utm`, (err) => {
                if (err) console.error(err)
                else {
                    this.ws.send(`|/challenge ${username}, ${format}`, (err2) => {
                        if (err2) console.error(err2)
                        else {

                        }
                    });
                }

            })

        }

        this.search = (format) => {
            this.ws.send(`|/utm`, (err) => {
                if (err) console.error(err)
                else {
                    this.ws.send(`|/search ${format}`, (err2) => {
                        if (err2) console.error(err2)
                        else {

                        }
                    });
                }

            })

        }


    };
};
