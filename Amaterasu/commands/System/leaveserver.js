const Command = require("../../util/Command.js");

class LeaveServer extends Command {
    constructor(client) {
      super(client, {
        name: "leaveserver",
        description: "Leaves the current server.",
        category: "System",
        usage: "leaveserver",
        guildOnly: true,
        permLevel: "Bot Admin" 
      });
    }

    async run(message, args, level, settings, texts) {
        if (!message.guild.available) return this.client.logger.info(`Guild "${message.guild.name}" (${message.guild.id}) is unavailable.`);
        message.reply("are you sure you want me to leave this guild? I can only be added back by users with the `MANAGE_GUILD` (Manage Server) permission. **(Y/N)**");
        return message.channel.awaitMessages(m => m.author.id === message.author.id, {
            "errors": ["time"],
            "max": 1,
            time: 20000
        }).then(resp => {
            if (!resp) return message.channel.send("Timed out.");
            resp = resp.array()[0];
            const validAnswers = ["Y", "N", "y", "n"];
            if (validAnswers.includes(resp.content)) {
                if (resp.content === "N" || resp.content === "n") {
                    return message.channel.send("Cool, looks like I won't be leaving.");
                } else if (resp.content === "Y" || resp.content === "y") {
                    message.channel.send("Use this if you ever want to add me back!\n**<https://discordapp.com/oauth2/authorize?&client_id=562602972777807872&scope=bot&permissions=66186303)>**");
                    message.guild.leave()
                        .then(guild => this.client.logger.info(`Left guild via command: ${guild}`))
                        .catch(err => {
                            this.client.logger.error(err);
                            return message.channel.send(`I tried to leave, but couldn't.`);
                        });
                }
            }
        });
    }
}

module.exports = LeaveServer;