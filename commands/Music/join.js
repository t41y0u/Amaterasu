const Command = require("../../util/Command.js");

class Join extends Command {
    constructor(client) {
        super(client, {
            name: "join",
            description: "Forces the bot to join your current call",
            category: "Music",
            usage: "join",
            guildOnly: true,
            aliases: ["summon"]
        });
    }

    async run(message, args, level) { 
        try {
            if (message.settings.djonly && !message.member.roles.some(c => c.name.toLowerCase() === message.settings.djrole.toLowerCase())) return message.client.embed("notDJ", message);
            const voiceChannel = message.member.voiceChannel;
            if (!voiceChannel) return this.client.embed("noVoiceChannel", message);
            const permissions = voiceChannel.permissionsFor(message.guild.me).toArray();
            if (!permissions.includes("CONNECT")) return this.client.embed("noPerms-CONNECT", message);
            if (!permissions.includes("SPEAK")) return this.client.embed("noPerms-SPEAK", message);
            const connection = await voiceChannel.join();
            this.client.embed("summoned", message);
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Join;