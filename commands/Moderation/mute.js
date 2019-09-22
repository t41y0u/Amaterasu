const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

class Mute extends Command {
    constructor(client) {
        super(client, {
            name: "mute",
            description: "Mutes the mentioned user.",
            category: "Moderation",
            usage: "mute <@user> <reason>",
            aliases: ["permmute", "perm"],
            permLevel:"Moderator",
            guildOnly: true
        });
    }

    async run(message, args, level) { 
        if (!message.guild.available) return this.client.logger.info(`Guild "${message.guild.name}" (${message.guild.id}) is unavailable.`);
        if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
            const embed = new RichEmbed().setColor(0x00FFFF).setAuthor("❌ Error").setDescription("I cannot create a \"Muted\" role, make sure I have the proper permissions!");
            return message.channel.send({embed});
        }
        const muteRole = message.guild.roles.find(role => role.name === "Muted");
        const empty = await this.isEmpty(muteRole);
        if (empty) {
            const roleRequest = await this.client.awaitReply(message, "A \"**Muted**\" role does not exist on this server. Would you like me to create one? (__Y__es / __N__o)", 30000);
            if (roleRequest.toLowerCase() === "y" || roleRequest.toLowerCase() === "yes") {
                message.guild.createRole({ name: "Muted" })
                    .then(role => message.channel.send(`✅ Created new role: **${role.name}**.`))
                    .catch(err => {
                        this.client.logger.error(err.stack);
                        return this.client.embed("", message);
                });
            } else {
                return message.channel.send("Cancelled. I will not create a \"Muted\" role. You will not be able to mute users without having a \"Muted\" role.");
            }
        }
        const user = message.mentions.users.first();
        let reason = args.slice(1).join(" ");
        if (!user) return message.channel.send("You must mention a user to mute.");
        if (user === message.author) return message.channel.send("You cannot mute yourself. 🤔");
        if (user.id === process.env.OWNER) return message.channel.send("I cannot mute my master.");
        if (message.guild.member(message.author).highestRole.position <= message.guild.member(user).highestRole.position) return message.channel.send("You cannot mute this user as they have a higher role than you.");
        if (!empty) {
            if (message.guild.member(user).roles.has(muteRole.id)) {
                return message.channel.send("The mentioned user is already muted.");
            }

            if (!reason) {
                message.channel.send("Please enter a reason for the mute...\nThis text-entry period will time-out in 60 seconds. Reply with `cancel` to exit.");
                await message.channel.awaitMessages(m => m.author.id === message.author.id, {
                    "errors": ["time"],
                    "max": 1,
                    time: 60000
                }).then(resp => {
                    if (!resp) return message.channel.send("Timed out. The user has not been muted.");
                    resp = resp.array()[0];
                    if (resp.content.toLowerCase() === "cancel") return message.channel.send("Cancelled. The user has not been muted.");
                    reason = resp.content;
                    if (resp) resp.react("✅");
                }).catch(() => {
                    message.channel.send("Timed out. The user has not been muted.");
                });
            }
            message.guild.channels.forEach(async (channel) => {
                await channel.overwritePermissions(muteRole, {
                    SEND_MESSAGES: false,
                    SPEAK: false
                }).catch(err => {
                    this.client.logger.error(err.stack);
                    return this.client.embed("", message);
                });
            });
            message.guild.member(user).addRole(muteRole.id)
                .then(member => message.channel.send(`**${member.user.tag}** was successfully muted.`))
                .catch(err => {
                    this.client.logger.error(err.stack);
                    return this.client.embed("", message);
                });
            try {
                const embed = new RichEmbed()
                    .setTitle(`🔇 Member muted in #${message.channel.name}`)
                    .setColor(16772735)
                    .setDescription(stripIndents`
                    \`\`\`css
                      Target: ${user.tag} (${user.id})
                      Issued by: ${message.author.tag} (${message.author.id})
                      Reason: ${reason}
                    \`\`\`
                    `)
                    .setFooter("Moderation system powered by Amaterasu", this.client.user.displayAvatarURL)
                    .setTimestamp();
                user.send(stripIndents`
                You were muted by staff in the **${message.guild.name}** server for the reason "${reason}".
                Please ensure you follow all the rules of the server in the future to avoid this occurring again.`);
            } catch (err) {
                this.client.logger.error(err.stack);
                return this.client.embed("", message);
            }
        }
    }

    async isEmpty(obj) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) return false;
        }
        return true;
    }
}

module.exports = Mute;