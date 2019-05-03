const Command = require("../base/Command.js");

class Love extends Command {
    constructor (client) {
        super(client, {
            name: "love",
            description: "Shows how in love you are with a user.",
            usage: "love [user]",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        let love = [];
        if (!message.mentions.members.first()) message.guild.members.forEach(member => {
            if (!member.user.bot && !member.user.id !== message.author.id) {
                love.push(member);
            }
        });
        else {
            love.push(message.mentions.members.first());
        }
        let member = love.random();
        message.channel.send(`${message.author.tag} is ${Math.floor(Math.random() * 100 + 1)}% in love with ${member.user.tag}`);
    }
}

module.exports = Love;