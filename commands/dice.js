const Command = require("../base/Command.js");
const Discord = require("discord.js");

class Dice extends Command {
    constructor (client) {
        super(client, {
            name: "dice",
            description: "Rolls a dice.",
            usage: "dice",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        const replies = ["One", "Two", "Three", "Four", "Five", "Six"];
        const result = Math.floor((Math.random() * replies.length));
        try {
            const embed = new Discord.RichEmbed()
                .setAuthor("A dice has been rolled!")
                .setColor("#0x00FFFF")
                .setDescription(`Rolled By: ${message.author.tag}\nResult: ${replies[result]}`);
            message.channel.send({embed});
        } catch (e) {
            console.log(e.stack);
        };
    }
}

module.exports = Dice;
