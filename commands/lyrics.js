const Command = require("../base/Command.js");
const fetch = require("node-fetch");

class Lyrics extends Command {
    constructor (client) {
        super(client, {
            name: "lyrics",
            description: "Fetches lyrics of requested song.",
            category: "Music",
            usage: "lyrics <song>",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        function checkStatus(res) {
            if (res.ok) {
                return res.json();
            } else {
                return message.reply("there was an error processing your request. Please try again later.");
            }
        }
        if (!args) {
            return message.reply("you have to specify a song to search!");
        }
        let search = [], rxp = /\<([^>]+)\>/g, curMatch;
        args = args.join(" ");
        while (curMatch = rxp.exec(args)) {
            search.push(curMatch[1]);
        }
        if (!search[1]) {
            fetch(`https://genius-lyrics.herokuapp.com/search?track=${encodeURIComponent(search[0].toProperCase())}`)
            .then(checkStatus)
            .then(data => {
                let lyrics = data.lyrics.toString();
                if (lyrics.length < 2048) {
                    message.channel.send({
                        embed: {
                            color: 0x00FFFF,
                            title: `${data.title} - ${data.artist}`,
                            description: `${lyrics}`
                        }
                    });
                } else {
                    let a = lyrics.split('\n'), s = "", first = true;
                    for (var i = 0; i < a.length; i++) {
                        if (s.length + a[i].length + 1 > 2048) {
                            if (first) {
                                message.channel.send({
                                    embed: {
                                        color: 0x00FFFF,
                                        title: `${data.title} - ${data.artist}`,
                                        description: `${s}`
                                    }
                                });
                                first = false;
                            } else {
                                message.channel.send({
                                    embed: {
                                        color: 0x00FFFF,
                                        description: `${s}`
                                    }
                                });
                            }
                            s = "";
                        }
                        s += (a[i] + '\n');
                    }
                    if (s.length) {
                        message.channel.send({
                            embed: {
                                color: 0x00FFFF,
                                description: `${s}`
                            }
                        });
                    }
                }
            });
        } else {
            fetch(`https://genius-lyrics.herokuapp.com/search?track=${encodeURIComponent(search[0].toProperCase())}&artist=${encodeURIComponent(search[1].toProperCase())}`)
            .then(checkStatus)
            .then(data => {
                console.log(search[1]);
                let lyrics = data.lyrics.toString();
                if (lyrics.length < 2048) {
                    message.channel.send({
                        embed: {
                            color: 0x00FFFF,
                            title: `${data.title} - ${data.artist}`,
                            description: `${lyrics}`
                        }
                    });
                } else {
                    let a = lyrics.split('\n'), s = "", first = true;
                    for (var i = 0; i < a.length; i++) {
                        if (s.length + a[i].length + 1 > 2048) {
                            if (first) {
                                message.channel.send({
                                    embed: {
                                        color: 0x00FFFF,
                                        title: `${data.title} - ${data.artist}`,
                                        description: `${s}`
                                    }
                                });
                                first = false;
                            } else {
                                message.channel.send({
                                    embed: {
                                        color: 0x00FFFF,
                                        description: `${s}`
                                    }
                                });
                            }
                            s = "";
                        }
                        s += (a[i] + '\n');
                    }
                    if (s.length) {
                        message.channel.send({
                            embed: {
                                color: 0x00FFFF,
                                description: `${s}`
                            }
                        });
                    }
                }
            });
        }
    }
}

module.exports = Lyrics;