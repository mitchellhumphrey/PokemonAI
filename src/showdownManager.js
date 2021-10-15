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
        this.room;
        this.side;

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


            let test = event.data.split("\n")
            console.log(test);
            for (let x of test) {
                if (x.startsWith("|challstr")) {
                    this.emit("challstr", x.slice(10)); //the slice removes the |challstr| from the message
                }
                else if (x.startsWith(">")) {
                    this.room = x.slice(1);
                }
                // else if (x.startsWith("|player")) {
                //     this.side = x.slice(8, 10)
                //     console.log(this.side);
                // }
                else if (x.startsWith("|request")) {
                    if ("wait" in JSON.parse(x.slice(9))) {
                    }
                    else if ("forceSwitch" in JSON.parse(x.slice(9))) {
                        this.emit("forceSwitch", x.slice(9));
                    }
                    else {
                        this.side = JSON.parse(x.slice(9)).side.id;
                        this.state = x.slice(9)
                        this.emit("request", x.slice(9))
                    }
                    console.log(x.slice(9))
                }
                else if (x.startsWith("|error")) {
                    this.emit("error");
                }
                else if (x.startsWith("|faint|" + this.side)) {
                    this.emit("faint")
                }
                else if (x.startsWith("|win|")) {
                    this.emit("win")
                }
                else if (x.startsWith("|loss|")) {
                    this.emit("less")
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
