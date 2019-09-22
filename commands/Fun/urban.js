const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const fetch = require("node-fetch");

class Urban extends Command {
    constructor(client) {
      super(client, {
        name: "urban",
        description: "Searches the Urban Dictionary for the specified query.",
        category: "Fun",
        usage: "urban <query>",
        aliases: ["urbandictionary", "udictionary", "urban-dictionary", "urbdict"]
      });
    }

    async run(message, args, level) {
        const embed = new RichEmbed().setColor(0x00FFFF);
        if (!message.channel.nsfw) {
            embed.setTitle("🔞 NSFW").setDescription("This command may contain some NSFW content so make sure you use this in a NSFW channel.");
            return message.channel.send({embed});
        }
        const query = args.join(" ");
        if (!query) return this.client.embed("commonError", message, "Please provide a query for me to search from the Urban Dictionary database.");
        fetch(`http://api.urbandictionary.com/v0/define?term=${query}`)
            .then(res => res.json())
            .then(json => {
                const data = json.list[0];
                const definition = data.definition.replace(/[[\]]+/g, "");
                const example = data.example.replace(/[[\]]+/g, "");
                const embed = new RichEmbed()
                    .setColor(0x00FFFF)
                    .setAuthor("Urban Dictionary", "https://vgy.me/ScvJzi.jpg")
                    .setDescription(`Displaying Urban Dictionary definition for "[${data.word}](${data.permalink})"`)
                    .addField("❯ Definition", `**${definition.substring(0, 1000)}...**`)
                    .addField("❯ Example", `${example.substring(0, 1000)}...`)
                    .setFooter(`Definition #1 of ${json.list.length}`)
                    .setTimestamp();
                return message.channel.send({embed});
            })
            .catch(err => {
                this.client.logger.error(err.stack);
                return this.client.embed("APIError", message);
            });
    }
}

module.exports = Urban;