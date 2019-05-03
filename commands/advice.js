const Command = require("../base/Command.js");
const request = require("superagent");

class Avatar extends Command {
    constructor (client) {
        super(client, {
            name: "advice",
            description: "Returns a random life advice.",
            category: "Info",
            usage: "advice",
            guildOnly: true,
            aliases: ["adv"]
        });
    }

    async run (message, args, level) {
        request.get("http://api.adviceslip.com/advice").end((err, res) => {
            if (!err && res.status === 200) {
                try {
                    JSON.parse(res.text);
                } catch (e) {
                    return message.reply("an api error occurred.");
                }
                const advice = JSON.parse(res.text);
                message.channel.send({
                    embed: {
                        color: 0x00FFFF,
                        title: advice.slip.advice
                    }
                });
            } else {
                console.error(`REST call failed: ${err}, status code: ${res.status}`)
            }
        });
    }
}

module.exports = Avatar;