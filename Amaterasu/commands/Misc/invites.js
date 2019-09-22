const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const arraySort = require("array-sort");
const t = require("table");

class Invites extends Command {
    constructor(client) {
        super(client, {
            name: "invites",
            description: "Displays the server's invite leaderboard.",
            category: "Misc",
            usage: "invites",
            guildOnly: true
        });
    }

    async run(message, args, level) { 
        try {
            const embed = new RichEmbed().setColor(0x00FFFF)
            if (!message.guild.me.hasPermission("MANAGE_GUILD")) {
                embed.setAuthor("❌ Error").setDescription("I cannot access to the server's invite leaderboard, make sure I have the proper permissions!");
                return message.channel.send({embed});
            }
            let invites = await message.guild.fetchInvites();
            if (invites.size === 0) {
                embed.setAuthor("❌ Error").setDescription("Currently there are no invites in this server. Go and invite more people!");
                return message.channel.send({embed});
            }
            invites = invites.array();
            arraySort(invites, "uses", { reverse: true });
            const usedInvites = [["User", "Uses"]];
            invites.forEach(invite => usedInvites.push([invite.inviter.tag, invite.uses]));
            embed.setTitle(`📜 Server Invite Leaderboard for ${message.guild.name}`).setDescription(t.table(usedInvites));
            return message.channel.send({embed});
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Invites;