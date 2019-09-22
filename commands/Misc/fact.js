const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const request = require("request");

class Fact extends Command {
    constructor (client) {
        super(client, {
            name: "fact",
            description: "Returns a random fun fact.",
            category: "Misc",
            usage: "fact",
            guildOnly: true
        });
    }

    async run (message, args, level) {
        try {
            request({url: 'https://nekos.life/api/v2/fact', json: true}, (req, res, json) => {
                const embed = new RichEmbed().setColor(0x00FFFF).setTitle(json.fact);
                message.channel.send({embed});
            });
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("APIError", message);
        }
    }
}

module.exports = Fact;