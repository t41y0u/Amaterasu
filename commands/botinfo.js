const Command = require("../base/Command.js");
const Discord = require("discord.js");
const { version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

class BotInfo extends Command {
    constructor (client) {
        super(client, {
            name: "botinfo",
            description: "Displays Mai-san's statistics.",
            category: "Info",
            usage: "botinfo",
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        const duration = moment.duration(this.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
        const embed = new Discord.RichEmbed()
            .setAuthor("Mai-san", this.client.user.displayAvatarURL)
            .setColor(0x00FFFF)
            .addField("Version", "1.6", true)
            .addField("Memory Usage", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
            .addField("Library", `Discord.js v${version}` , true)
            .addField("Creator", "Mai-san#1202", true)
            .addField("Servers", `${this.client.guilds.size}`, true)
            .addField("Users", `${this.client.users.size}`, true)
            .addField("Channels", `${this.client.channels.size}`, true)
            .addField("Invite", `[Invite Mai-san](https://discordapp.com/oauth2/authorize?&client_id=562602972777807872&scope=bot&permissions=66186303)`, true)
            .setFooter(`Uptime: ${duration}`);
        message.channel.send({embed});
    }
}

module.exports = BotInfo;
