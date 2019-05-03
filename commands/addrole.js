const Command = require("../base/Command.js");

class AddRole extends Command {
    constructor (client) {
        super(client, {
            name: "addrole",
            description: "Gives an user an existing role.",
            category: "Mods",
            usage: "addrole <user> <role>",
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
                return message.channel.send("Sorry, I couldn't find that user.");
            }
            let role = args[1];
            if (!role) {
                return message.reply("please specify a role!");
            }
            let gRole = message.guild.roles.find(r => r.name === role);
            if (!gRole) {
                return message.channel.send("Sorry, I couldn't find that role.");
            }
            if (rMember.roles.has(gRole.id)) {
                return message.channel.send("They already have that role.");
            } else {
                rMember.addRole(gRole.id).catch(console.error);
                try {
                    rMember.send(`Congrats, you have been given the role ${gRole.name}`);
                    message.channel.send(`The ~~insect~~ user ${rMember} has a new role ${gRole.name}`);
                } catch(e) {
                    console.log(e.stack);
                    message.channel.send(`Congrats to ${rMember}, they have been given the role ${gRole.name}.`);
                }
            }
        }
    }
}

module.exports = AddRole;
