const Command = require("../base/Command.js");
const Discord = require("discord.js");

class Poll extends Command {
    constructor (client) {
        super(client, {
            name: "poll",
            description: "Starts a poll on something.",
            usage: "poll <question>",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        if (!args.join(' ')) {
            return message.reply('you need to supply the question');
        }
        const embed = new Discord.RichEmbed()
            .setColor(0x00FFFF)
            .setTitle(args.join(' '))
            .setDescription(`Poll created by ${message.author.tag}`)
        const msg = await message.channel.send({embed});
        await msg.react('👍');
        await msg.react('👎');
        await msg.react('🤷');
    }
}

module.exports = Poll;