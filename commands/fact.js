const Command = require("../base/Command.js");
const request = require("request");

class Fact extends Command {
    constructor (client) {
        super(client, {
            name: "fact",
            description: "Returns a random fun fact.",
            usage: "fact",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        request({url: 'https://nekos.life/api/v2/fact', json: true}, (req, res, json) => {
            message.channel.send({
                embed: {
                    color: 0x00FFFF,
                    title: json.fact,
                }
            });
        });
    }
}

module.exports = Fact;