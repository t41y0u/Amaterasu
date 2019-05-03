const Command = require("../base/Command.js");

class Kick extends Command {
    constructor (client) {
        super(client, {
            name: "kick",
            description: "Kick a certain user.",
            category: "Mods",
            usage: "kick <user> [reason]",
            guildOnly: true,
            aliases: ["none"],
            permLevel: "Server Owner"
        });
    }

    async run (message, args, level) {
        if (!message.member.hasPermission("KICK_MEMBERS") && message.member.id !== this.config.owner) {
            return message.reply("you don't have the permissions to use this command!");
        }
        const member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!member) {
            return message.reply("please mention a valid member of this server");
        }
        if (!member.kickable || member.id === this.config.owner) {
            return message.reply("I cannot kick this user! They have a higher role than Kaguya-chan!");
        }
        const reason = args.join(" ");
        if (!reason) {
            reason = "No reason provided";
        }
        await member.kick(reason).catch(error => message.reply(`sorry, I couldn't kick because of: ${error}`));
        message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ~~They are insects~~ ${reason}`);
    }
}

module.exports = Kick;
