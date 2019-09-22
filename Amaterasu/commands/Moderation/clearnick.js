const Command = require("../../util/Command.js");

class ClearNick extends Command {
    constructor(client) {
        super(client, {
            name: "clearnick",
            description: "Clears a user's nickname.",
            category: "Moderation",
            usage: "clearnick <@user>",
            aliases: ["clearnickname", "cn"],
            permLevel: "Moderator",
            guildOnly: true
        });
    }

    async run(message, args, level) { 
        const user = message.mentions.users.first();
        if (!user) return this.client.embed("commonError", message, "Please provide a user to clear a nickname for.");
        const nick = message.guild.member(user).nickname;
        if (!nick) return this.client.embed("commonError", message, "The mentioned user does not currently have a nickname.");
        if (!message.guild.me.hasPermission("MANAGE_NICKNAMES")) return this.client.embed("commonError", message, "I cannot change any nicknames, as I do not have the \"Manage Nicknames\" permission.");
        if (message.guild.member(user).highestRole.position >= message.guild.me.highestRole.position) return this.client.embed("commonError", message, "I do not have permission to change this user's nickname.");
        message.guild.member(user).setNickname("", "Clearing bad nickname")
            .catch(err => {
                if (err.message === "Privilege is too low...") {
                    return this.client.embed("commonError", message, "I do not have permission to change this user's nickname.");
                } else {
                    this.client.logger.error(err.stack);
                    return this.client.embed("", message);
                }
            });
    }
}

module.exports = ClearNick;