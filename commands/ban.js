const Command = require("../base/Command.js");

class Ban extends Command {
    constructor (client) {
        super(client, {
            name: "ban",
            description: "Ban a certain user.",
            category: "Mods",
            usage: "ban <user> [reason]",
            guildOnly: true,
            aliases: ["none"],
            permLevel: "Server Owner"
        });
    }

    async run (message, args, level) {
        if (!message.member.hasPermission("BAN_MEMBERS") && message.member.id !== this.config.owner) {
            return message.reply("you don't have the permissions to use this command!");
        }
        const member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!member) {
            return message.reply("please mention a valid member of this server");
        }
        if (!member.banable || member.id === this.config.owner) {
            return message.reply("I cannot ban this user! They have a higher role than Kaguya-chan!");
        }
        const reason = args.join(" ");
        if (!reason) {
            reason = "No reason provided";
        }
        await member.ban(reason).catch(error => message.reply(`sorry, I couldn't ban because of: ${error}`));
        message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ~~they are insects~~ ${reason}`);
    }
}

module.exports = Ban;
