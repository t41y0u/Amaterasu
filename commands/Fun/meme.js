const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const request = require("request");

class Meme extends Command {
    constructor (client) {
        super(client, {
            name: "meme",
            description: "Returns a meme from Reddit.",
            category: "Fun",
            usage: "meme",
            guildOnly: true,
            aliases: ["mm"]
        });
    }

    async run (message, args, level) {
        try {
            request("https://reddit.com/r/meme/random.json", async function (error, response, json) {
                const data = JSON.parse(json)[0]["data"]["children"][0]["data"];
                let msg = null;
                if (data["url"].match(".jpg") || data["url"].match(".png")) {
                    const embed = new RichEmbed()
                        .setColor(0x00FFFF)
                        .setTitle(`${data["title"]}`)
                        .setURL(`https://reddit.com${data["permalink"]}`)
                        .setFooter(`Author: ${data["author"]} | Upvote ratio: ${data["upvote_ratio"] * 100}%`)
                        .setImage(data["url"])
                    msg = await message.channel.send({embed});
                } else {
                    const embed = new RichEmbed()
                        .setColor(0x00FFFF)
                        .setTitle(`${data["title"]}`)
                        .setURL(`https://reddit.com${data["permalink"]}`)
                        .setFooter(`Author: ${data["author"]} | Upvote ratio: ${data["upvote_ratio"] * 100}%`)
                        .setImage(data["url"]+".jpg")
                    msg = await message.channel.send({embed});
                }
                await msg.react("⬆");
                await msg.react("⬇");
            });
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("APIError", message);
        }
    }
}

module.exports = Meme;