const Command = require("../base/Command.js");
const Discord = require("discord.js");

class ServerInfo extends Command {
    constructor (client) {
        super(client, {
            name: "serverinfo",
            description: "Displays the current info of this server.",
            category: "Info",
            usage: "serverinfo",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        function checkDays(date) {
            let now = new Date();
            let diff = now.getTime() - date.getTime();
            let days = Math.floor(diff / 86400000);
            return days + (days == 1 ? " day" : " days") + " ago";
        };
        let verifLevels = ["None", "Low", "Medium", "(╯°□°）╯︵  ┻━┻", "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"];
        let region = { "brazil": ":flag_br: Brazil", "eu-central": ":flag_eu: Central Europe", "singapore": ":flag_sg: Singapore", "us-central": ":flag_us: U.S. Central", "sydney": ":flag_au: Sydney", "us-east": ":flag_us: U.S. East", "us-south": ":flag_us: U.S. South", "us-west": ":flag_us: U.S. West", "eu-west": ":flag_eu: Western Europe", "vip-us-east": ":flag_us: VIP U.S. East", "london": ":flag_gb: London", "amsterdam": ":flag_nl: Amsterdam", "hongkong": ":flag_hk: Hong Kong", "russia": ":flag_ru: Russia", "southafrica": ":flag_za:  South Africa" };
        const embed = new Discord.RichEmbed()
            .setColor(0x00FFFF)
            .setAuthor(`${message.guild.name}'s info`, message.guild.iconURL)
            .setThumbnail(message.guild.iconURL)
            .addField("Owner", `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`, true)
            .addField("Region", region[message.guild.region], true)
            .addField("Channels | Text | Voice", `${message.guild.channels.size} | ${message.guild.channels.filter(channel => channel.type === 'text').size} | ${message.guild.channels.filter(channel => channel.type === 'voice').size}`, true)
            .addField("Total | Humans | Bots", `${message.guild.members.size} | ${message.guild.members.filter(member => !member.user.bot).size} | ${message.guild.members.filter(member => member.user.bot).size}`, true)
            .addField("Online | Idle | Do Not Disturb | Offline", `${message.guild.members.filter(member => member.presence.status === 'online').size} | ${message.guild.members.filter(member => member.presence.status === 'idle').size} | ${message.guild.members.filter(member => member.presence.status === 'dnd').size} | ${message.guild.members.filter(member => member.presence.status === 'offline').size}`)
            .addField("Verification Level", verifLevels[message.guild.verificationLevel], true)
            .addField("Roles", message.guild.roles.size, true)
            .setFooter(`ID: ${message.guild.id} | Server created • ${message.channel.guild.createdAt.toUTCString().substr(0, 16)} (${checkDays(message.channel.guild.createdAt)})`)
        message.channel.send({embed});
    }
}

module.exports = ServerInfo;
