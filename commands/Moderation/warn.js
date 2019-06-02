const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");

class Warn extends Command {
    constructor(client) {
        super(client, {
            name: "warn",
            description: "Issues a warning to the specified user.",
            category: "Moderation",
            usage: "warn <@user> <reason/info>",
            guildOnly: true,
            aliases: ["w"],
            permLevel: "Moderator"
        });
    }

    async run(message, args, level) {
        if (!message.guild.available) return this.client.logger.info(`Guild "${message.guild.name}" (${message.guild.id}) is unavailable.`);
        if (!message.guild.me.permissions.has(["EMBED_LINKS", "ADD_REACTIONS"])) {
            const embed = new RichEmbed().setColor(0x00FFFF).setTitle("❌ Error").setDescription("I cannot create an embed link or add emojis, make sure I have the proper permissions!");
            return message.channel.send({embed});
        }
        const user = message.mentions.users.first();
        let reason = args.slice(1).join(" ") || undefined;
        if (!user) return message.channel.send("You must mention a user to warn.");
        if (message.guild.member(message.author).highestRole.position <= message.guild.member(user).highestRole.position) return message.channel.send("You cannot warn this user as they have the same role or a higher role than you.");
        if (!reason) {
            message.channel.send("Please enter a reason for the warn...\nThis text-entry period will time-out in 60 seconds. Reply with `cancel` to exit.");
            await message.channel.awaitMessages(m => m.author.id === message.author.id, {
                "errors": ["time"],
                "max": 1,
                time: 60000
            }).then(resp => {
                if (!resp) return message.channel.send("Timed out. The user has not been warned.");
                resp = resp.array()[0];
                if (resp.content.toLowerCase() === "cancel") return message.channel.send("Cancelled. The user has not been warned.");
                reason = resp.content;
                if (resp) resp.react("✅");
            }).catch(() => {
                message.channel.send("Timed out. The user has not been warned.");
            });
        }
        if (reason) {
            try {
                const embed = new RichEmbed()
                    .setTitle(`⚠️ Warning issued in #${message.channel.name}`)
                    .setColor(0x00FFFF)
                    .setDescription(`\`\`\`ruby\nIssued to: ${user.tag} (${user.id})\nIssued by: ${message.author.tag} (${message.author.id})\nReason: ${reason}\`\`\``)
                    .setFooter("Moderation system powered by Amaterasu", this.client.user.displayAvatarURL)
                    .setTimestamp();
                if (!user.bot) user.send(`Hello,\nYou were warned in **${message.guild.name}** for the reason "**${reason}**".\nPlease make sure you always follow the rules, because not doing so can lead to punishments.`);
                message.react("👌");
            } catch (error) {
                this.client.logger.error(err.stack);
                return this.client.embed("", message);
            }
        }
    }
}

module.exports = Warn;
