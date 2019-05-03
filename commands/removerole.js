const Command = require("../base/Command.js");

class RemoveRole extends Command {
    constructor (client) {
        super(client, {
            name: "removerole",
            description: "Removes an existing role from an user.",
            category: "Mods",
            usage: "removerole <user> <role>",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
        if (!message.member.hasPermission("MANAGE_ROLES_OR_PERMISSIONS")) {
            message.reply("you don't have the permissions to use this command!");
        } else {
            if (!rMember) {
                return message.channel.send("Kaguya-chan couldn't find that user.");
            }
            let role = args[1];
            if (!role) {
                return message.reply("please specify a role!");
            }
            let gRole = message.guild.roles.find(r => r.name === role);
            if (!gRole) {
                return message.channel.send("Kaguya-chan couldn't find that role.");
            }
            if (!rMember.roles.has(gRole.id)) {
                return message.channel.send("They don't even have that role to remove.");
            } else {
                rMember.removeRole(gRole.id).catch(console.error);
                try {
                    rMember.send(`Sorry, you lost the ${gRole.name} role`);
                    message.channel.send(`The ~~insect~~ user ${rMember} has lost the ${gRole.name} role`);
                } catch(e) {
                    console.log(e.stack);
                    message.channel.send(`RIP to ${rMember}, we removed ${gRole.name} from them.`);
                }
            }
        }
    }
}

module.exports = RemoveRole;
