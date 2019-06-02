const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");

class Ban extends Command {
    constructor(client) {
        super(client, {
            name: "ban",
            description: "Bans the mentioned user from the server.",
            category: "Moderation",
            usage: "ban <@user> <reason>",
            guildOnly: true,
            aliases: ["banish", "permban"],
            permLevel: "Moderator"
        });
    }

    async run(message, args, level) {
        if (!message.guild.available) return this.client.logger.info(`Guild "${message.guild.name}" (${message.guild.id}) is unavailable.`);
        const user = message.mentions.users.first();
        let reason = args.slice(1).join(" ") || undefined;
        if (!user) return this.client.embed("commonError", message, "Please mention a user to ban.");
        if (user === message.author) return this.client.embed("commonError", message, "You cannot ban yourself. 🤔");
        if (user.id === process.env.OWNER) return this.client.embed("commonError", message, "I cannot ban my master.");
        if (message.guild.member(message.author).highestRole.position <= message.guild.member(user).highestRole.position) return this.client.embed("commonError", message, "You cannot ban this user as they have a higher role than you.");
        if (!reason) {
            message.channel.send("Please enter a reason for the ban...\nThis text-entry period will time-out in 60 seconds. Reply with `cancel` to exit.");
            await message.channel.awaitMessages(m => m.author.id === message.author.id, {
                "errors": ["time"],
                "max": 1,
                time: 60000
            }).then(resp => {
                if (!resp) return message.channel.send("Timed out. The user has not been banned.");
                resp = resp.array()[0];
                if (resp.content.toLowerCase() === "cancel") return message.channel.send("Cancelled. The user has not been banned.");
                reason = resp.content;
                if (resp) resp.react("✅");
            }).catch(() => {
                message.channel.send("Timed out. The user has not been banned.");
            });
        }
        if (reason) {
            try {
                if (!message.guild.member(user).bannable) return this.client.embed("commonError", message, "I cannot ban that user from this server!\nThis may be because I do not have the required permissions to do so, or they may be the server owner.");
                if (user === message.author) return this.client.embed("commonError", message, "You cannot ban yourself. 🤔");
                try {
                    const lastMessage = message.guild.member(user).lastMessageID;
                    const embed = new RichEmbed()
                        .setTitle(`🚫 Member banned from ${message.guild.name}`)
                        .setColor(0x00FFFF)
                        .setDescription(`\`\`\`css\nTarget: ${user.tag} (${user.id})\nIssued by: ${message.author.tag} (${message.author.id})\nReason: ${reason}\nDuration: Permanent\nLast message: ${lastMessage}\`\`\``)
                        .setFooter("Moderation system powered by Amaterasu", this.client.user.displayAvatarURL)
                        .setTimestamp(); 
                    message.guild.member(user).ban({embed});
                    message.react("👌");
                } catch (err) {
                    this.client.logger.error(err.stack);
                    return this.client.embed("", message);
                }
            } catch (err) {
                this.client.logger.error(err.stack);
                return this.client.embed("", message);
            }
        }
    }
}

module.exports = Ban;