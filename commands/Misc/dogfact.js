const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const request = require("superagent");

class DogFact extends Command {
    constructor (client) {
        super(client, {
            name: "dogfact",
            description: "Returns a dogfact.",
            category: "Misc",
            usage: "dogfact",
            guildOnly: true
        });
    }

    async run (message, args, level) {
        try {
            request.get("https://dog-api.kinduff.com/api/facts").end((err, res) => {
                if (!err && res.status === 200) {
                    const embed = new RichEmbed().setColor(0x00FFFF).setTitle(res.body.facts[0]);
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

module.exports = DogFact;