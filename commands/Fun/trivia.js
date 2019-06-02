const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const snekfetch = require("snekfetch");
const h = new (require("html-entities").AllHtmlEntities)();

class Trivia extends Command {
    constructor(client) {
        super(client, {
            name: "trivia",
            description: "Puts your general knowledge to the test.",
            category: "Fun",
            usage: "trivia [difficulty]",
            aliases: ["randomtrivia", "randomq", "testme", "quiz"]
        });
    }

    async run(message, args, level) {
        try {
            const levels = ["easy", "medium", "hard"];
            const difficulty = args[0] || "medium";
            if (!levels.includes(difficulty.toLowerCase())) return this.client.embed("commonError", message, "Invalid difficulty specified. Please choose from one of **easy**, **medium** or **hard**.");
            const { body } = await snekfetch.get(`https://opentdb.com/api.php?amount=50&difficulty=${difficulty.toLowerCase()}&type=multiple`);
            const quiz = body.results.random();
            const choices = quiz.incorrect_answers.map(ans => h.decode(ans));
            choices.push(h.decode(quiz.correct_answer));
            console.log(h.decode(quiz.correct_answer));
            const randomChoices = new Array(4);
            for (let i = 0; i < 4; i++) {
                randomChoices[i] = choices.random();
                choices.splice(choices.indexOf(randomChoices[i]), 1);
            }
            const embed = new RichEmbed()
                .setColor(0x00FFFF)
                .setAuthor("Trivia", "https://vgy.me/9UDUk0.png")
                .addField("❯\u2000\Question", `\u2000${h.decode(quiz.question)}\n\`🇦\` ${randomChoices[0]}\n\`🇧\` ${randomChoices[1]}\n\`🇨\` ${randomChoices[2]}\n\`🇩\` ${randomChoices[3]}`)
                .addField("❯\u2000\Category", h.decode(quiz.category), true)
                .addField("❯\u2000\Difficulty", h.decode(quiz.difficulty.toProperCase()), true)
                .setFooter("React to the correct letter within 30 seconds or react ⏩ to skip!", message.author.displayAvatarURL);
            const msg = await message.channel.send({embed});
            msg.react("🇦").then(() => msg.react("🇧")).then(() => msg.react("🇨")).then(() => msg.react("🇩")).then(() => msg.react("⏩"))
            const filter = (reaction, user) => {
                return ["🇦", "🇧", "🇨", "🇩", "⏩"].includes(reaction.emoji.name) && user.id === message.author.id;
            };
            const collector = msg.createReactionCollector((reaction, user) => user !== this.client.user, { time: 30000 })
            collector.on('collect', async (reaction) => {
                let response = null;
                if (reaction.emoji.name === "🇦") {
                    response = "A";
                } else if (reaction.emoji.name === "🇧") {
                    response = "B";
                } else if (reaction.emoji.name === "🇨") {
                    response = "C";
                } else if (reaction.emoji.name === "🇩") {
                    response = "D";
                } else {
                    response = "skip";
                }
                await reaction.remove(reaction.users.filter(user => user !== this.client.user).first());
                const embed = new RichEmbed().setColor(0x00FFFF)
                if (response === "skip") {
                    embed.setAuthor("⏩ Skipped").setDescription(`You chose to skip the session ~~because you're dumb~~. The correct answer was **${h.decode(quiz.correct_answer)}**.`).setFooter("Trivia session ended.");
                    return message.channel.send({embed});
                }
                const choice = randomChoices[["a", "b", "c", "d"].indexOf(response.toLowerCase())];
                if (choice === h.decode(quiz.correct_answer)) embed.setAuthor("✅ Accepted").setDescription(`Congratulation! You have solved this trivia. The correct answer was **${h.decode(quiz.correct_answer)}**.`).setFooter("Trivia session ended.");
                else embed.setAuthor("❌ Wrong Answer").setDescription(`Unfortunately, that's the wrong answer. The correct answer was **${h.decode(quiz.correct_answer)}**, and you chose **${randomChoices[["a", "b", "c", "d"].indexOf(response.toLowerCase())]}**.`).setFooter("Trivia session ended.");
                return message.channel.send({embed});
            });
            collector.on('end', async (reaction) => {
                const embed = new RichEmbed().setColor(0x00FFFF).setAuthor("⌛ Timed out").setDescription(`The session timed out as you did not answer within 30 seconds. The correct answer was **${h.decode(quiz.correct_answer)}**.`).setFooter("Trivia session ended.");
                return message.channel.send({embed});
            })
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("APIError", message);
        }
    }
}

module.exports = Trivia;
