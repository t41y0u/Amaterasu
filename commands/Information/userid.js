const Command = require("../../util/Command.js");

class UserID extends Command {
    constructor(client) {
      super(client, {
        name: "userid",
        description: "Returns the mentioned user's user ID.",
        category: "Information",
        usage: "userid [@user]",
        aliases: ["id"]
      });
    }

    async run(message, args, level, settings, texts) {
        try {
            const user = message.mentions.users.first() || message.author;
            const embed = new RichEmbed().setColor(0x00FFFF).setTitle(`**${user.tag}**'s user ID is: \`${user.id}\`.`);
            message.channel.send({embed});
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = UserID;