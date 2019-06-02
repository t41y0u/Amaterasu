const Command = require("../../util/Command.js");

class Bans extends Command {
    constructor(client) {
        super(client, {
            name: "bans",
            description: "Checks how many users are banned on the current server.",
            category: "Moderation",
            usage: "bans",
            guildOnly: true,
            aliases: ["fetchbans"],
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
                message.channel.send(`This server has **${bans.size}** banned ${bans.size === 1 ? "user" : "users"}.`);
            })
            .catch(err => {
                this.client.logger.error(err.stack);
                return this.client.embed("", message);
            });
    }
}

module.exports = Bans;
