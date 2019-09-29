const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");

class Invite extends Command {
    constructor(client) {
        super(client, {
            name: "invite",
            description: "Generates an invite link, for adding Amaterasu to a server.",
            category: "Misc",
            usage: "invite",
            aliases: ["join"]
        });
    }

    async run(message, args, level) { 
        try {
            message.channel.send("Generating...")
            .then(msg => {
                const embed = new RichEmbed().setColor(0x00FFFF).setTitle("Invite Link").setDescription("[Click here](https://discordapp.com/oauth2/authorize?&client_id=562602972777807872&scope=bot&permissions=1547086070)");
                msg.edit({embed});
            });
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Invite;