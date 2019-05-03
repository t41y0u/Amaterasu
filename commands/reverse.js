const Command = require("../base/Command.js");

class Reverse extends Command {
    constructor (client) {
        super(client, {
            name: "reverse",
            description: "Reverses a text.",
            usage: "reverse <text>",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        if (!args[0]) {
            return message.reply('you need to input the text to reverse!');
        }
        const str = args.join(' ');
        let msg = await message.channel.send(str.split('').reverse().join(''));
        msg.react('🔁');
    }
}

module.exports = Reverse;
