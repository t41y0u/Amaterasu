const Command = require("../util/Command.js");

class Answer extends Command {
    constructor (client) {
        super(client, {
            name: "answer",
            description: "Answer the given quiz (answer is not case-sensitive)",
            usage: "answer <answer>",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        try {
            if (this.client.readytogo) {
                return message.reply("there's no quiz ongoing for you to answer.");
            }
            if (!args) {
                return message.reply("you need to specify the answer!");
            }
            let resp = args.join(" ").toLowerCase();
            let answer = this.client.quiz.answer.toLowerCase();
            if (resp === answer) {
                message.channel.send(`The quiz ended, and ${message.author} was the winner!`, {
                    embed: {
                        title: `A $${this.client.quiz.value} question!`,
                        thumbnail: {
                            url: 'https://i.imgur.com/BjB692J.png',
                        },
                        fields: [{
                            name: `The answer was **${this.client.quiz.answer}**!`,
                            value: `${this.client.quiz.question}`
                        }],
                        footer: {
                            text: `Requested by ${message.member.user.tag}`
                        },
                        color: 3987431
                    }
                });
                this.client.answered = this.client.readytogo = true;
            } else {
                return message.reply("wrong answer!");
            }
        } catch(err) {
            console.log(err);
            return this.client.embed(message);
        }
    }
}

module.exports = Answer;
