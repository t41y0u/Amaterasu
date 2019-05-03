const Command = require("../base/Command.js");
const Discord = require("discord.js");

class MemberCount extends Command {
    constructor (client) {
        super(client, {
            name: "membercount",
            description: "Displays the number of members in this server.",
            category: "Info",
            usage: "membercount",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        const embed = new Discord.RichEmbed()
            .setColor(0x00FFFF)
            .setAuthor(`${message.guild.name}'s membercount`, `${message.guild.iconURL}`)
            .addField("Members", `${message.guild.members.size}`, true)
            .addField("Online", `${message.guild.members.filter(member => member.presence.status === 'online').size}`, true)
            .addField("Humans", `${message.guild.members.filter(member => !member.user.bot).size}`, true)
            .addField("Bots", `${message.guild.members.filter(member => member.user.bot).size}`, true)
            .setTimestamp()
        message.channel.send({embed});
    }
}

module.exports = MemberCount;
