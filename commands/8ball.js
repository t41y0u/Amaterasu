const Command = require("../base/Command.js");

class EightBall extends Command {
    constructor (client) {
        super(client, {
            name: "8ball",
            description: "Ask the bot any question and she will answer it for you!",
            usage: "8ball <question>",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        const eightball = ["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes - definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don\'t count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."];
        if (args[0]) {
            message.reply(eightball[Math.floor(Math.random() * eightball.length).toString(10)]);
        } else {
            message.reply("Ummmm, what is your question? :rolling_eyes:"); 
        }
    }
}

module.exports = EightBall;
