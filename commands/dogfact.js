const Command = require("../base/Command.js");
const request = require("superagent");

class DogFact extends Command {
    constructor (client) {
        super(client, {
            name: "dogfact",
            description: "Returns a dogfact.",
            category: "Info",
            usage: "dogfact",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        request.get("https://dog-api.kinduff.com/api/facts").end((err, res) => {
            if (!err && res.status === 200) {
                message.channel.send({
                    embed:{
                        color: 0x00FFFF,
                        title: `${res.body.facts[0]}`
                    }
                });
            } else {
                console.log(`REST call failed: ${err}`);
                return message.reply("an api error occured.");
            }
        });
    }
}

module.exports = DogFact;