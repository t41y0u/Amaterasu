const Command = require("../base/Command.js");
const Discord = require("discord.js");
const urban = require("urban");

class Urban extends Command {
    constructor (client) {
        super(client, {
            name: "urbdict",
            description: "Searches an Urban Dictionary definition",
            category: "Info",
            usage: "urbdict <search-term>",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        urban(args.join(" ")).first(json => {
            if (!json) {
                return message.channel.send({
                    embed: {
                        "description": "Nothing found :sweat: ",
                        "color": 0xFF2222
                    }
                });
            }
            const embed = new Discord.RichEmbed()
                .setColor(0x00FFFF)
                .setDescription(json.definition)
                .addField('Example', json.example)
                .addField(`Upvotes`, json.thumbs_up, true)
                .addField(`Downvotes`, json.thumbs_down, true)
                .setFooter(`Written by ${json.author}`)
                .setTitle(json.word);
            message.channel.send(embed);
        });
    }
}

module.exports = Urban;
