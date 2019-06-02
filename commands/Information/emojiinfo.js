const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const moment = require("moment");

class EmojiInfo extends Command {
    constructor(client) {
        super(client, {
            name: "emojiinfo",
            description: "Displays information about the specified emoji.",
            category: "Information",
            usage: "emojiinfo <emoji>",
            aliases: ["emoji-info", "einfo"]
        });
    }

    async run(message, args, level) { 
        try {
            if (!args[0]) return this.client.embed("commonError", message, "Please provide an emoji for me to look up.");
            if (args[0].startsWith("<a:")) return this.client.embed("commonError", message, "This command does not support animated emojis yet.");
            if (args[0].charCodeAt(0) >= 55296) return message.channel.send(`${args[0]} is a regular Discord emoji, from Twemoji.\nhttps://twemoji.twitter.com`);
            const match = args[0].match(/<:[a-zA-Z0-9_-]+:(\d{18})>/);
            if (!match || !match[1]) return this.client.embed("commonError", message, "Please provide a valid emoji, from a server I am on.");
            const emoji = this.client.emojis.get(match[1]);
            if (!emoji) return this.client.embed("commonError", message, "Please provide a valid emoji, from a server I am on.");
            const embed = new RichEmbed()
                .setColor(0x00FFFF)
                .setTitle("Emoji Information")
                .setThumbnail(emoji.url)
                .addField("❯ Name", emoji.name, true)
                .addField("❯ ID", emoji.id, true)
                .addField("❯ Created", moment.utc(emoji.createdAt).format("DD/MM/YYYY"), true)
                .addField("❯ From", emoji.guild, true)
                .setFooter(`Info requested by ${message.author.tag}`, message.author.displayAvatarURL)
                .setTimestamp();
            return message.channel.send({embed});
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = EmojiInfo;
