const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");

class Discriminator extends Command {
    constructor(client) {
      super(client, {
        name: "discriminator",
        description: "Searches for users with the specified discriminator.",
        category: "Information",
        usage: "discriminator [#xxxx]",
        aliases: ["discrim", "discriminator-search", "discrim-search"]
      });
    }

    async run(message, args, level) {
        try {
            let discrim = args[0];
            if (!discrim) {
                discrim = message.author.discriminator;
            }
            if (discrim.startsWith("#")) {
                discrim = discrim.slice(1);
            }
            const embed = new RichEmbed().setColor(0x00FFFF)
            if (/^[0-9]+$/.test(discrim) && discrim.length === 4) {
                const users = this.client.users.filter(user => user.discriminator === discrim).map(user => user.username);
                if (users.length === 0) {
                    embed.setTitle("❌ Not found").setDescription(`After searching all my servers, no one with the discriminator **${discrim}** could be found. <:feelsbadman:379645743583199232>`)
                } else {
                    embed.setTitle(`${users.length} user(s) found with the discriminator ${discrim}`).setDescription(users.join(", "));
                }
            } else {
                embed.setTitle("❌ Error").setDescription("Invalid discriminator provided.");
            }
            message.channel.send({embed});
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Discriminator;