const Command = require("../base/Command.js");

class RPS extends Command {
    constructor (client) {
        super(client, {
            name: "rps",
            description: "Play Rock Paper Scissors with Kaguya-chan.",
            usage: "rps <rock|paper|scissors>",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        let choices = ['rock', 'paper', 'scissors'];
        args[0] = args[0].toLowerCase();
        if (!args[0]) {
            return message.reply('you need to input rock, paper, or scissors!');
        }
        if (!choices.includes(args[0])) {
            return message.reply('you need to choose rock, paper, or scissors!');
        }
        let urps = args[0];
        let brps = choices.random();
        let low;
        if (urps == brps) {
            low = 'Tie!';
        }
        if (urps == 'rock' && brps == 'paper' && !low) {
            low = 'I Win!';
        }
        if (urps == 'scissors' && brps == 'rock' && !low) {
            low = 'I Win!';
        }
        if (urps == 'paper' && brps == 'rock' && !low) {
            low = 'You Win!';
        }
        if (urps == 'rock' && brps == 'scissors' && !low) {
            low = 'You Win!';
        }
        if (urps == 'paper' && brps == 'scissors' && !low) {
            low = 'I Win!';
        }
        if (urps == 'scissors' && brps == 'paper' && !low) {
            low = 'You Win!';
        }
        message.channel.send({
            embed:{
                color: 0x00FFFF,
                title: low,
                description: `I choose ${brps}\nYou choose ${urps}`
            }
        });
    }
}

module.exports = RPS;
