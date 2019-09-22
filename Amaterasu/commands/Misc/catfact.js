const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const request = require("superagent");

class CatFact extends Command {
    constructor (client) {
        super(client, {
            name: "catfact",
            description: "Returns a catfact.",
            category: "Misc",
            usage: "catfact",
            guildOnly: true
        });
    }

    async run (message, args, level) {
        try {
            request.get("https://catfact.ninja/fact?max_length=256").end((err, res) => {
                if (!err && res.status === 200) {
                    const embed = new RichEmbed().setColor(0x00FFFF).setTitle(res.body.fact);
                    message.channel.send({embed});
                } else {
                    this.client.logger.error(err.stack);
                    return this.client.embed("APIError", message);
                }
            });
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = CatFact;