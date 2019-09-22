const Command = require("../util/Command.js");
const fetch = require("node-fetch")

class Quiz extends Command {
    constructor (client) {
        super(client, {
            name: "quiz",
            description: "Returns a quiz to solve.",
            usage: "quiz",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        try {
            if (!this.client.readytogo) {
                return message.reply("please answer the previous quiz or wait until it ended.");
            }
            await fetch("http://jservice.io/api/random?count=1")
                .then((res) => { 
                    return res.json() 
                })
                .then((jsonData) => {
                    this.client.quiz.question = jsonData[0].question.toString();
                    this.client.quiz.value = jsonData[0].value.toString();
                    this.client.quiz.answer = jsonData[0].answer.toString();
                    this.client.quiz.hint = jsonData[0].answer.replace(/\S/g, "⬜").trimEnd().replace(/\s/g, "⬛");
                    console.log(this.client.quiz.answer);
                })
                .catch((err) => {
                    console.error(err);
                });
            message.reply("here's a quiz for you!", {
                embed: {
                    title: `A $${this.client.quiz.value} question!`,
                    thumbnail: {
                        url: 'https://i.imgur.com/BjB692J.png',
                    },
                    fields: [{
                        name: `${this.client.quiz.hint}`,
                        value: `${this.client.quiz.question}`
                    }],
                    footer: {
                        text: `Requested by ${message.member.user.tag}`
                    },
                    color: 3987431
                }
            });
            this.client.answered = this.client.readytogo = false;
            const lol = () => {
                if (!this.client.answered) {
                    message.channel.send(`The quiz ended, and no one found the answer...`, {
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
                }
            }
            setTimeout(lol, 60000);
        } catch(err) {
            console.log(err);
            return this.client.embed(message);
        }
    }
}

module.exports = Quiz;
