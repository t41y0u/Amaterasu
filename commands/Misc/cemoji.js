const Command = require("../../util/Command.js");

class Emoji extends Command {
    constructor(client) {
        super(client, {
            name: "cemoji",
            description: "Creates a new emoji.",
            category: "Misc",
            usage: "cemoji <image link> <emoji name>",
            aliases: ["createemoji", "create-emoji"],
            guildOnly: true
        });
    }

    async run(message, args, level) {
        if (!message.guild.available) return this.client.logger.info(`Guild "${message.guild.name}" (${message.guild.id}) is unavailable.`);
        if (!message.member.hasPermission("MANAGE_EMOJIS")) return this.client.embed("commonError", message, "as you do not have the \"Manage Emojis\" permission, you cannot use this command.");
        const image = args[0] ? args[0].replace(/<(.+)>/g, "$1") : null;
        const name = args[1];
        let isImgLink;
        if (!image) return this.client.embed("commonError", message, "Please provide a valid **Imgur** or **vgy.me** image link, to create an emoji from.");
        if (image.startsWith("https://i.imgur") || image.startsWith("https://vgy.me")) {
            isImgLink = true;
        } else {
            isImgLink = false;
        }
        if (image.split(".").pop() !== "png") isImgLink = false;
        if (isImgLink === false) return this.client.embed("commonError", message, "Invalid image link.\nPlease ensure the image link you've provided is from either Imgur or vgy.me, starts with `https://` and ends with `.png`.");
        if (!name) return this.client.embed("commonError", message, "Please provide a name for the new emoji.");
        message.guild.createEmoji(image, name)
            .then(emoji => message.channel.send(`Created new emoji: <:${emoji.name}:${emoji.id}>.`))
            .catch(err => {
                if (err.message === "404 Not Found") return this.client.embed("commonError", message, "An image could not be found at that link.");
                this.client.logger.error(err.stack);
                return this.client.embed("", message);
            });
    }
}

module.exports = Emoji;