const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");

class ForceBan extends Command {
    constructor(client) {
        super(client, {
            name: "forceban",
            description: "Bans a user, even if they aren't in your server.",
            category: "Moderation",
            usage: "ban <userID> <reason>",
            guildOnly: true,
            aliases: ["hackban", "xban"],
            permLevel: "Moderator"
        });
    }

    async run(message, args, level) { 
        if (!message.guild.available) return this.client.logger.info(`Guild "${message.guild.name}" (${message.guild.id}) is unavailable.`);
        const userID = args[0];
        const reason = args.slice(1).join(" ");
        if (!userID) return this.client.embed("commonError", message, "Please provide an user ID to ban.");
        if (!reason) return this.client.embed("commonError", message, "Please provide a reason for the punishment.");
        if (userID === message.author.id) return this.client.embed("commonError", message, "You cannot ban yourself. 🤔");
        if (userID === process.env.OWNER) return this.client.embed("commonError", message, "I cannot ban my master.");
        message.guild.ban(userID, { reason: reason })
            .then(() => {
                message.reply(`successfully banned the user with the ID **${userID}**.`);
                message.react("👌");
            })
            .catch(error => {
                this.client.logger.error(error);
                return message.channel.send(`An error occurred whilst trying to ban the specified user ID:\n\`\`\`${error.message}\`\`\``);
            });
        const embed = new RichEmbed()
            .setTitle(`🚫 Member force-banned from ${message.guild.name}`)
            .setColor(0x00FFFF)
            .setDescription(`\`\`\`css\nTarget: ${userID}\nIssued by: ${message.author.tag} (${message.author.id})\nReason: ${reason}\`\`\``)
            .setFooter("Moderation system powered by Amaterasu", this.client.user.displayAvatarURL)
            .setTimestamp();
    }
}

module.exports = ForceBan;