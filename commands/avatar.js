const Command = require("../base/Command.js");
const Discord = require("discord.js");

class Avatar extends Command {
    constructor (client) {
        super(client, {
            name: "avatar",
            description: "Displays avatar of a certain user.",
            category: "Info",
            usage: "avatar [user]",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        const member = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;
        const embed = new Discord.RichEmbed()
            .setAuthor(`${member.user.tag}'s avatar`, member.user.displayAvatarURL)
            .setColor(0x00FFFF)
            .setImage(member.user.displayAvatarURL)
    	message.channel.send({embed});
    }
}

module.exports = Avatar;