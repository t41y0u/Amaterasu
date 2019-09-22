const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");

class Avatar extends Command {
    constructor(client) {
      super(client, {
        name: "avatar",
        description: "Sends the mentioned user's avatar.",
        category: "Information",
        usage: "avatar [@mention]",
        aliases: ["ava", "avy"]
      });
    }

    async run(message, args, level) {
        try {
            const user = message.mentions.users.first() || message.author;
            const embed = new RichEmbed()
                .setTitle(`🖼️ ${user.tag}'s avatar`)
                .setDescription(`🔗 **[Direct URL](${user.displayAvatarURL})**`)
                .setImage(user.displayAvatarURL);
            return message.channel.send({embed});
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Avatar;