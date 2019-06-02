const Command = require("../../util/Command.js");
const request = require("superagent");

class DogFact extends Command {
    constructor (client) {
        super(client, {
            name: "insult",
            description: "Insults the tagged user or the message sender if no one is tagged.",
            category: "Fun",
            usage: "insult [user]",
            guildOnly: true,
        });
    }

    async run (message, args, level) {
        try {
            const user = message.mentions.members.first() || message.guild.members.get(args[0]) || message.guild.members.get(message.author.id);
            if (user.id === "562602972777807872") {
                return message.reply("I can't insult myself");
            }
            if (user.id === process.env.OWNER) {
                return message.reply("I can't insult my master");
            }
            request.get("https://insult.mattbas.org/api/insult").end((err, res) => {
                if (!err && res.status === 200) {
                    message.channel.send(`${user}, ${res.text}`);
                } else {
                    console.log(`REST call failed: ${err}`);
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