const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");

class LastMessage extends Command {
    constructor(client) {
        super(client, {
            name: "lastmessage",
            description: "Returns the mentioned user's last message.",
            category: "Misc",
            usage: "lastmessage [@user]",
            aliases: ["lm"],
            guildOnly: true
        });
    }

    async run(message, args, level) {
        try {
            const member = message.mentions.members.first() || message.member;
            if (!member) return this.client.embed("commonError", message, "Please mention a user whose last message you'd like to see.");
            const lastMsg = message.guild.member(member).lastMessage;
            if (!lastMsg) return this.client.embed("commonError", message, "This user's last message could not be found, or they simply may not have sent any messages here.");            
            const embed = new RichEmbed()
                .setColor(0x00FFFF)
                .setAuthor(member.user.tag, member.user.displayAvatarURL)
                .setDescription(`*${lastMsg}*`)
                .setFooter(`#${message.channel.name}`)
                .setTimestamp();
            message.channel.send({embed});
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
  }
}

module.exports = LastMessage;
