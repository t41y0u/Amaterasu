const Command = require("../../util/Command.js");
const Discord = require("discord.js");
const translate = require("@k3rn31p4nic/google-translate-api");

const langs = ['afrikaans', 'albanian', 'amharic', 'arabic', 'armenian', 'azerbaijani', 'bangla', 'basque', 'belarusian', 'bengali', 'bosnian', 'bulgarian', 'burmese', 'catalan', 'cebuano', 'chichewa', 'chinese simplified', 'chinese traditional', 'corsican', 'croatian', 'czech', 'danish', 'dutch', 'english', 'esperanto', 'estonian', 'filipino', 'finnish', 'french', 'frisian', 'galician', 'georgian', 'german', 'greek', 'gujarati', 'haitian creole', 'hausa', 'hawaiian', 'hebrew', 'hindi', 'hmong', 'hungarian', 'icelandic', 'igbo', 'indonesian', 'irish', 'italian', 'japanese', 'javanese', 'kannada', 'kazakh', 'khmer', 'korean', 'kurdish (kurmanji)', 'kyrgyz', 'lao', 'latin', 'latvian', 'lithuanian', 'luxembourgish', 'macedonian', 'malagasy', 'malay', 'malayalam', 'maltese', 'maori', 'marathi', 'mongolian', 'myanmar (burmese)', 'nepali', 'norwegian', 'nyanja', 'pashto', 'persian', 'polish', 'portugese', 'punjabi', 'romanian', 'russian', 'samoan', 'scottish gaelic', 'serbian', 'sesotho', 'shona', 'sindhi', 'sinhala', 'slovak', 'slovenian', 'somali', 'spanish', 'sundanese', 'swahili', 'swedish', 'tajik', 'tamil', 'telugu', 'thai', 'turkish', 'ukrainian', 'urdu', 'uzbek', 'vietnamese', 'welsh', 'xhosa', 'yiddish', 'yoruba', 'zulu'];

class Translate extends Command {
    constructor (client) {
        super(client, {
            name: "translate",
            description: "Translates a text.",
            usage: "translate <from-language> <to-language> <text>",
            category: "Misc",
            guildOnly: true,
            aliases: ["trans"]
        });
    }

    async run (message, args, level) {
        try {
            if (!args[0]) {
                return this.client.embed("commonError", message, "Please provide a language for me to translate from.");
            } else {
                if (!args[1]) {
                    return this.client.embed("commonError", message, "Please provide a language for me to translate into.");
                } else {
                    if (!args[2]) {
                        return this.client.embed("commonError", message, "Please provide a text for me to translate.");
                    } else {
                        if (args[0].toLowerCase() === "chinese-simplified") {
                            args[0] = "chinese simplified";
                        }
                        if (args[0].toLowerCase() === "chinese-traditional") {
                            args[0] = "chinese traditional";
                        }
                        if (args[1].toLowerCase() === "chinese-simplified") {
                            args[1] = "chinese simplified";
                        }
                        if (args[1].toLowerCase() === "chinese-traditional") {
                            args[1] = "chinese traditional";
                        }
                        let fr = args[0].toLowerCase();
                        let to = args[1].toLowerCase();
                        args = args.slice(2).join(" ");
                        if (!langs.includes(fr) || !langs.includes(to)) {
                            return this.client.embed("commonError", message, "Language not found.");
                        }
                        if (args.length > 2800) {
                            return this.client.embed("commonError", message, "Unfortunately, the specified text is too long. Please try again with something a little shorter.");
                        }
                        translate(args, { from: fr, to: to }).then(res => {
                            /*const embed = new Discord.RichEmbed()
                                .setColor(0x00FFFF)
                                .setAuthor("Google Translate")
                                .addField(":inbox_tray: Input", `\`\`\`${res.from.text.autoCorrect ? res.from.text.value : args}\`\`\``)
                                .addField(":outbox_tray: Output", `\`\`\`${res.text}\`\`\``);
                            return message.channel.send(embed);*/
                            return message.channel.send(res.text);
                        });
                    }
                }
            }
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Translate;