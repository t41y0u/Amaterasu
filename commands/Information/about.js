const Command = require("../../util/Command.js");
const amaterasu = require("../../package.json");
const { RichEmbed, version } = require("discord.js");
const moment = require("moment");

class About extends Command {
    constructor(client) {
        super(client, {
            name: "about",
            description: "Displays information about me!",
            category: "Information",
            usage: "about",
            aliases: ["info", "botinfo"]
        });
    }

    async run(message, args, level) {
        try {
            const embed = new RichEmbed()
                .setColor(0x00FFFF)
                .setThumbnail(this.client.user.displayAvatarURL)
                .setTitle(`Hey ${message.author.username}, I'm ${amaterasu.name}!`)
                .setDescription(`${amaterasu.description}`)
                .addField("❯\u2000\Version", amaterasu.version, true)
                .addField("❯\u2000\Users", this.client.users.size, true)
                .addField("❯\u2000\Invite link", "[Click here](https://discordapp.com/oauth2/authorize?&client_id=562602972777807872&scope=bot&permissions=66186303)", true)
                .addField("❯\u2000\Uptime", `${moment.utc(this.client.uptime).format("DD")-1} day(s), ${moment.utc(this.client.uptime).format("HH:mm:ss")}`, true)
                .addField("❯\u2000\GitHub", "[Click here](https://github.com/Kaguya-chan/Amaterasu)", true)
                .addField("❯\u2000\Node.js version", process.version, true)
                .addField("❯\u2000\Memory usage", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
                .setFooter(`Made with Discord.js (v${version})`, "https://vgy.me/ZlOMAx.png")
                .setTimestamp();
            message.channel.send({embed});
        } catch (err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = About;