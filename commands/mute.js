const Command = require("../base/Command.js");
const ms = require("ms");

class Mute extends Command {
    constructor (client) {
        super(client, {
            name: "mute",
            description: "Mutes a certain user for a specific time.",
            category: "Mods",
            usage: "mute [user] [time]",
            guildOnly: true,
            aliases: ["none"],
            permLevel: "Server Owner"
        });
    }

    async run (message, args, level) {
        if (!message.member.hasPermission("MANAGE_MESSAGES") && message.member.id !== this.config.owner) {
            message.reply("you don't have the permissions to use this command!");
        }
        let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if (!tomute) {
            return message.reply("sorry, I couldn't find this user.");
        }
        if (tomute.hasPermission("MANAGE_MESSAGES") || tomute.id === this.config.owner) {
            return message.reply("sorry, I can't mute this user!");
        }
        let muterole = message.guild.roles.find(r => r.name === "Muted");
        if (!muterole) {
            try {
                muterole = await message.guild.createRole({
                    name: "Muted",
                    color: "#000000",
                    permissions:[]
                })
                message.guild.channels.forEach(async (channel, id) => {
                    await channel.overwritePermissions(muterole, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                    });
                });
            } catch(e) {
                console.log(e.stack);
            }
        }
        let mutetime = args[1];
        if (!mutetime) {
            return message.reply("please specify a time!");
        }
        await(tomute.addRole(muterole.id));
        message.reply(`${tomute} has been muted for ${ms(ms(mutetime))}`);
        setTimeout(function() {
            tomute.removeRole(muterole.id);
            message.channel.send(`${tomute} has been unmuted! Yay!`);
        }, ms(mutetime));
    }
}

module.exports = Mute;
