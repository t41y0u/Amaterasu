const Command = require("../../util/Command.js");
const fetch = require("node-fetch");

class Lyrics extends Command {
    constructor (client) {
        super(client, {
            name: "lyrics",
            description: "Returns lyrics of requested song (currently unavailable due to API error).",
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
                return this.client.embed("APIError", message);
            }
        }
        try {
            if (!args) {
                return message.reply("you have to specify a song to search!");
            }
            const search = args.join(" ");
            message.channel.startTyping();
            fetch(`https://genius-lyrics.herokuapp.com/search?track=${encodeURIComponent(search)}`)
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
            message.channel.stopTyping(true);
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Lyrics;