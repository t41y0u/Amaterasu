const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const snekfetch = require("snekfetch");
const h = new (require("html-entities").AllHtmlEntities)();

const categoryChoices = {
    "General Knowledge": "9",
    "Entertainment: Books": "10",
    "Entertainment: Film": "11",
    "Entertainment: Music": "12",
    "Entertainment: Musicals & Theatres": "13",
    "Entertainment: Television": "14",
    "Entertainment: Video Games": "15",
    "Entertainment: Board Games": "16",
    "Science & Nature": "17",
    "Science: Computers": "18",
    "Science: Mathematics": "19",
    "Mythology": "20",
    "Sports": "21",
    "Geography": "22",
    "History": "23",
    "Politics": "24",
    "Art": "25",
    "Celebrities": "26",
    "Animals": "27",
    "Vehicles": "28",
    "Entertainment: Comics": "29",
    "Science: Gadgets": "30",
    "Entertainment: Japanese Anime & Manga": "31",
    "Entertainment: Cartoon & Animations":" 32"
};

class Trivia extends Command {
    constructor(client) {
        super(client, {
            name: "trivia",
            description: "Puts your general knowledge to the test.",
            category: "Fun",
            usage: "trivia [difficulty] [category]",
            aliases: ["randomtrivia", "randomq", "testme", "quiz"]
        });
    }

    async run(message, args, level) {
        try {
            const levels = ["easy", "medium", "hard"];
            const categories = [
                "General Knowledge", 
                "Entertainment: Books", 
                "Entertainment: Film", 
                "Entertainment: Music",
                "Entertainment: Musicals & Theatres",
                "Entertainment: Television",
                "Entertainment: Video Games",
                "Entertainment: Board Games",
                "Science & Nature",
                "Science: Computers",
                "Science: Mathematics",
                "Mythology",
                "Sports",
                "Geography",
                "History",
                "Politics",
                "Art",
                "Celebrities",
                "Animals",
                "Vehicles",
                "Entertainment: Comics",
                "Science: Gadgets",
                "Entertainment: Japanese Anime & Manga",
                "Entertainment: Cartoon & Animations"
            ];
            let difficulty = "medium";
            let category = "General Knowledge";
            if (args[0]) {
                if (args[0].toLowerCase() === "categories") {
                    const embed = new RichEmbed()
                        .setColor(0x00FFFF)
                        .setAuthor("Trivia", "https://vgy.me/9UDUk0.png")
                        .setDescription(`**Available categories are:** \n${categories.join("\n")}`)
                        .setTimestamp()
                        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL)
                    return message.channel.send({embed});
                }
                else if (!levels.includes(args[0].toLowerCase())) category = args.join(" ");
                else {
                    difficulty = args[0].toLowerCase();
                    if (args[1]) category = args.splice(1).join(" ");
                }
            }
            if (!levels.includes(difficulty)) return this.client.embed("commonError", message, "Invalid difficulty specified. Please choose from one of **easy**, **medium** or **hard**.");
            if (!categories.includes(category)) return this.client.embed("commonError", message, `Invalid category specified. Please choose from one of **${categories.join("**, **")}**.`);
            const { body } = await snekfetch.get(`https://opentdb.com/api.php?amount=1&difficulty=${difficulty}&category=${categoryChoices[category]}&type=multiple`);
            const quiz = body.results[0];
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
            const msg = await message.channel.send({embed}); let ongoing = "yes";
            msg.react("🇦").then(() => msg.react("🇧")).then(() => msg.react("🇨")).then(() => msg.react("🇩")).then(() => msg.react("⏩"))
            const filter = (reaction, user) => {
                return ["🇦", "🇧", "🇨", "🇩", "⏩"].includes(reaction.emoji.name) && user === message.author && user !== this.client.user;
            };
            const collector = msg.createReactionCollector(filter, { time: 30000 })
            collector.on('collect', async (reaction) => {
                if (!ongoing) return await reaction.remove(reaction.users.filter(user => user !== this.client.user).first());
                let response = null;
                if (reaction.emoji.name === "🇦") response = "A";
                else if (reaction.emoji.name === "🇧") response = "B";
                else if (reaction.emoji.name === "🇨") response = "C";
                else if (reaction.emoji.name === "🇩") response = "D";
                else response = "skip";
                await reaction.remove(reaction.users.filter(user => user !== this.client.user).first());
                const embed = new RichEmbed().setColor(0x00FFFF)
                if (response === "skip") {
                    embed.setAuthor("⏩ Skipped").setDescription(`You chose to skip the session ~~because you're dumb~~. The correct answer was **${h.decode(quiz.correct_answer)}**.`).setFooter("Trivia session ended.");
                    ongoing = undefined;
                    return message.channel.send({embed});
                }
                const choice = randomChoices[["a", "b", "c", "d"].indexOf(response.toLowerCase())];
                if (choice === h.decode(quiz.correct_answer)) embed.setAuthor("✅ Accepted").setDescription(`Congratulation! You have solved this trivia. The correct answer was **${h.decode(quiz.correct_answer)}**.`).setFooter("Trivia session ended.");
                else embed.setAuthor("❌ Wrong Answer").setDescription(`Unfortunately, that's the wrong answer. The correct answer was **${h.decode(quiz.correct_answer)}**, and you chose **${randomChoices[["a", "b", "c", "d"].indexOf(response.toLowerCase())]}**.`).setFooter("Trivia session ended.");
                ongoing = undefined;
                return message.channel.send({embed});
            });
            collector.on('end', async (reaction) => {
                if (!ongoing) return;
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
