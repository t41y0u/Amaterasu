const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

class Unmute extends Command {
    constructor(client) {
        super(client, {
            name: "unmute",
            description: "Undoes the mentioned user's mute.",
            category: "Moderation",
            usage: "unmute <@user> <reason>",
            permLevel: "Moderator",
            guildOnly: true
        });
    }

    async run(message, args, level, settings, texts) {
        if (!message.guild.available) return this.client.logger.info(`Guild "${message.guild.name}" (${message.guild.id}) is unavailable.`);
        if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
            const embed = new RichEmbed().setColor(0x00FFFF).setTitle("❌ Error").setDescription("I cannot create a \"Muted\" role, make sure I have the proper permissions!");
            return message.channel.send({embed});
        }
        const muteRole = message.guild.roles.find(role => role.name === "Muted");
        const empty = await this.isEmpty(muteRole);
        if (empty) return message.channel.send(`A "Muted" role does not exist on this server. To create one, please run the \`${this.client.settings.prefix}mute\` command.`);
        const user = message.mentions.users.first();
        let reason = args.slice(1).join(" ");
        if (!user) return message.channel.send("You must mention a user to unmute.");
        if (user.id === message.author.id) return message.channel.send("You cannot unmute yourself. 🤔");
        if (message.guild.member(message.author).highestRole.position <= message.guild.member(user).highestRole.position) return message.channel.send("You cannot unmute this user as they have a higher role than you.");
        if (!reason) {
            message.channel.send("Please enter a reason for unmuting this user...\nThis text-entry period will time-out in 60 seconds. Reply with `cancel` to exit.");
            await message.channel.awaitMessages(m => m.author.id === message.author.id, {
                "errors": ["time"],
                "max": 1,
                time: 60000
            }).then(resp => {
                if (!resp) return message.channel.send("Timed out.");
                resp = resp.array()[0];
                if (resp.content.toLowerCase() === "cancel") return message.channel.send("Cancelled.");
                reason = resp.content;
                if (resp) resp.react("✅");
            }).catch(() => {
                message.channel.send("Timed out.");
            });
        }
        if (message.guild.member(user).roles.has(muteRole.id)) {
            message.guild.member(user).removeRole(muteRole).then(() => {
                message.react("👌");
            });
        } else {
            return message.channel.send("The mentioned user isn't muted, so I cannot unmute them.");
        }
        try {
            const embed = new RichEmbed()
                .setTitle("🔊 Member unmuted")
                .setColor(12451456)
                .setDescription(stripIndents`
                \`\`\`css
                  User: ${user.tag} (${user.id})
                  Undone by: ${message.author.tag} (${message.author.id})
                  Reason: ${reason}
                \`\`\`
                `)
                .setFooter("Moderation system powered by Amaterasu", this.client.user.displayAvatarURL)
                .setTimestamp();
            user.send(`You have been unmuted in **${message.guild.name}**.\nPlease ensure you always follow the rules to prevent being muted again!`);
        } catch (error) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }

    async isEmpty(obj) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) return false;
        }
        return true;
    }
}

module.exports = Unmute;