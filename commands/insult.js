const Command = require("../base/Command.js");
const request = require("superagent");

class DogFact extends Command {
    constructor (client) {
        super(client, {
            name: "insult",
            description: "Insults the tagged user or the message sender if no one is tagged.",
            usage: "insult [user]",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        const user = message.mentions.members.first() || message.guild.members.get(args[0]) || message.guild.members.get(message.author.id);
        if (user.id === "562602972777807872") {
            return message.reply("I can't insult myself");
        }
        if (user.id === "470612022472736788") {
            return message.reply("I can't insult my master");
        }
        request.get("https://insult.mattbas.org/api/insult").end((err, res) => {
            if (!err && res.status === 200) {
                message.channel.send(`${user}, ${res.text}`);
            } else {
                console.log(`REST call failed: ${err}`);
                return message.reply("an api error occured.");
            }
        });
    }
}

module.exports = DogFact;