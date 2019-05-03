const Command = require("../base/Command.js");
const Discord = require("discord.js");
const moment = require("moment");

class UserInfo extends Command {
    constructor (client) {
        super(client, {
            name: "userinfo",
            description: "Displays the info of a certain user.",
            category: "Info",
            usage: "userinfo [user]",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        var permissions = [];
        var acknowledgements = 'None';
        var manager = false;
        const status = { online: "Online", idle: "Idle", dnd: "Do Not Disturb", offline: "Offline/Invisible" };
        const member = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;
        if (message.member.hasPermission("ADMINISTRATOR")) {
            permissions.push("Administrator");
            manager = true;
        }
        if (message.member.hasPermission("KICK_MEMBERS")) {
            permissions.push("Kick Members");
            manager = true;
        }
        if (message.member.hasPermission("BAN_MEMBERS")) {
            permissions.push("Ban Members");
            manager = true;
        }
        if (message.member.hasPermission("MANAGE_MESSAGES")) {
            permissions.push("Manage Messages");
            manager = true;
        }
        if (message.member.hasPermission("MANAGE_CHANNELS")) {
            permissions.push("Manage Channels");
            manager = true;
        }
        if (message.member.hasPermission("MENTION_EVERYONE")) {
            permissions.push("Mention Everyone");
        }
        if (message.member.hasPermission("MANAGE_NICKNAMES")) {
            permissions.push("Manage Nicknames");
            manager = true;
        }
        if (message.member.hasPermission("MANAGE_ROLES")) {
            permissions.push("Manage Roles");
            manager = true;
        }
        if (message.member.hasPermission("MANAGE_WEBHOOKS")) {
            permissions.push("Manage Webhooks");
            manager = true;
        }
        if (message.member.hasPermission("MANAGE_EMOJIS")) {
            permissions.push("Manage Emojis");
            manager = true;
        }
        if (permissions.length == 0) {
            permissions.push("No Key Permissions Found");
        }
        if (`${member.user.id}` == message.guild.owner.id) {
            acknowledgements = 'Server Owner';
            manager = false;
        }
        if (manager === true) {
            acknowledgements = 'Server Manager';
        }
        function getJoinRank(member) {
            if (!message.guild.member(member.id)) {
                return;
            }
            let list = message.guild.members.array();
            list.sort((a, b) => a.joinedAt - b.joinedAt);
            for (let index = 0; index < list.length; index++) {
                if (list[index].id == member.id) {
                    return (index + 1);
                }
            }
        }
        const embed = new Discord.RichEmbed()
            .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL)
            .setColor(0x00FFFF)
            .setFooter(`ID: ${message.author.id}`)
            .setThumbnail(member.user.displayAvatarURL)
            .setTimestamp()
            .addField("Status",`${status[member.user.presence.status]}`, true)
            .addField("Joined at",`${moment(member.joinedAt).format("dddd, MMMM Do YYYY, HH:mm:ss")}`, true)
            .addField("Join Position", getJoinRank(member), true)
            .addField("Created at",`${moment(member.user.createdAt).format("dddd, MMMM Do YYYY, HH:mm:ss")}`, true)
            .addField(`Roles [${member.roles.filter(r => r.id !== message.guild.id).map(roles => `\`${roles.name}\``).length}]`,`${member.roles.filter(r => r.id !== message.guild.id).map(roles => `<@&${roles.id }>`).join(" **|** ") || "No Roles"}`, true)
            .addField("Permissions", `${permissions.join(', ')}`, true)
            .addField("Acknowledgements", `${acknowledgements}`, true);
        message.channel.send({embed});
    }
}

module.exports = UserInfo;
