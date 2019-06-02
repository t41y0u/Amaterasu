const Command = require("../../util/Command.js");
const flipFrames = [
    "(-°□°)-  ┬─┬",
    "(╯°□°)╯    ]",
    "(╯°□°)╯  ︵  ┻━┻",
    "(╯°□°)╯       [",
    "(╯°□°)╯           ┬─┬"
];

class TableFlip extends Command {
    constructor(client) {
        super(client, {
            name: "tableflip",
            description: "Flips a table, in real-time! (╯°□°)╯",
            category: "Fun",
            usage: "tableflip", 
            aliases: ["tf"]
        });
    }

    async run(message, args, level) { 
        try {
            const msg = await message.channel.send("(\\\\°□°)\\\\  ┬─┬");
            for (const frame of flipFrames) {
                await this.client.wait(300);
                await msg.edit(frame);
            }
            return msg;
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = TableFlip;