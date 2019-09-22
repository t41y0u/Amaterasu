const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

class BanList extends Command {
    constructor(client) {
      super(client, {
        name: "banlist",
        description: "DMs you a list of banned users.",
        category: "Moderation",
        usage: "banlist",
        guildOnly: true,
        aliases: ["bl"],
        permLevel: "Moderator"
      });
    }

    async run(message, args, level) { 
        if (!message.guild.available) return this.client.logger.info(`Guild "${message.guild.name}" (${message.guild.id}) is unavailable.`);
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
            const embed = new RichEmbed().setColor(0x00FFFF).setTitle("❌ Error").setDescription("I cannot access to the server's banlist, make sure I have the proper permissions!");
            return message.channel.send({embed});
        }
        message.guild.fetchBans()
            .then(bans => {
                const obj = bans.map(b => ({
                    user: `${b.username}#${b.discriminator}`
                }));
                const bList = Array.from(obj);
                if (bList.length < 1) return message.author.send(`There are no banned users on **${message.guild.name}**.`);
                let index = 0;
                const embed = new RichEmbed().setTitle(`Ban List for ${message.guild.name}`).setDescription(`${bList.map(bl => `**${++index} -** ${bl.user}`).join("\n")}`);
                message.author.send({embed});
                message.react("👌");
            })
            .catch(err => {
                this.client.logger.error(err.stack);
                return this.client.embed("", message);
            });
    }
}

module.exports = BanList;