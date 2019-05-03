const Command = require("../base/Command.js");
const request = require("superagent");

class CatFact extends Command {
    constructor (client) {
        super(client, {
            name: "catfact",
            description: "Returns a catfact.",
            category: "Info",
            usage: "catfact",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        request.get("https://catfact.ninja/fact?max_length=256").end((err, res) => {
            if (!err && res.status === 200) {
                message.channel.send({
                    embed:{
                        color: 0x00FFFF,
                        title: `${res.body.fact}`
                    }
                });
            } else {
                console.log(`REST call failed: ${err}`);
                return message.reply("an api error occured.");
            }
        });
    }
}

module.exports = CatFact;