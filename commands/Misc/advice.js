const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const request = require("superagent");

class Avatar extends Command {
    constructor (client) {
        super(client, {
            name: "advice",
            description: "Returns a random life advice.",
            category: "Misc",
            usage: "advice",
            guildOnly: true,
            aliases: ["adv"]
        });
    }

    async run (message, args, level) {
        try {
            request.get("http://api.adviceslip.com/advice").end((err, res) => {
                if (!err && res.status === 200) {
                    try {
                        JSON.parse(res.text);
                    } catch (err) {
                        this.client.logger.error(err.stack);
                        return this.client.embed("APIError", message);
                    }
                    const advice = JSON.parse(res.text);
                    const embed = new RichEmbed().setColor(0x00FFFF).setTitle(advice.slip.advice);
                    message.channel.send({embed});
                } else {
                    console.error(`REST call failed: ${err}, status code: ${res.status}`)
                    return this.client.embed("APIError", message);
                }
            });
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("APIError", message);
        }
    }
}

module.exports = Avatar;