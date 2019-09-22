const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const slots = ["🍇", "🍊", "🍐", "🍒", "🍋"];

class Slots extends Command {
    constructor(client) {
        super(client, {
            name: "slots",
            description: "Spin the slot machine!",
            category: "Fun",
            usage: "slots",
            aliases: ["slotmachine"],
            guildOnly: true
        });
    }

    async run(message, args, level) {
        try {
            const slotOne = slots[Math.floor(Math.random() * slots.length)];
            const slotTwo = slots[Math.floor(Math.random() * slots.length)];
            const slotThree = slots[Math.floor(Math.random() * slots.length)];
            const embed = new RichEmbed().setColor(0x00FFFF)
            if (slotOne === slotTwo && slotOne === slotThree) {
                embed.setTitle(`🎰 Jackpot! ${slotOne}|${slotTwo}|${slotThree}`)
                return message.channel.send({embed});
            }
            if (slotOne === slotTwo || slotOne === slotThree || slotTwo === slotThree) {
                embed.setTitle(`🎰 So close! ${slotOne}|${slotTwo}|${slotThree}`)
                return message.channel.send({embed});
            }
            embed.setTitle(`🎰 Not a chance! ${slotOne}|${slotTwo}|${slotThree}`)
            return message.channel.send({embed});
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Slots;
