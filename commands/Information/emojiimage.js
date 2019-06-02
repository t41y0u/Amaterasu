const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");

class EmojiImage extends Command {
    constructor(client) {
      super(client, {
        name: "emojiimage",
        description: "Sends the specified emoji as an image.",
        category: "Information",
        usage: "emojiimage <emoji>",
        aliases: ["emoji-image", "bigemoji", "hugemoji", "hugeemoji"]
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
                .setTitle(emoji.name)
                .setImage(emoji.url);
            return message.channel.send({embed});
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = EmojiImage;
