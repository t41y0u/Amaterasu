const Command = require("../base/Command.js");
const Discord = require("discord.js");
const translate = require("@k3rn31p4nic/google-translate-api");

const langs = ['afrikaans', 'albanian', 'amharic', 'arabic', 'armenian', 'azerbaijani', 'bangla', 'basque', 'belarusian', 'bengali', 'bosnian', 'bulgarian', 'burmese', 'catalan', 'cebuano', 'chichewa', 'chinese simplified', 'chinese traditional', 'corsican', 'croatian', 'czech', 'danish', 'dutch', 'english', 'esperanto', 'estonian', 'filipino', 'finnish', 'french', 'frisian', 'galician', 'georgian', 'german', 'greek', 'gujarati', 'haitian creole', 'hausa', 'hawaiian', 'hebrew', 'hindi', 'hmong', 'hungarian', 'icelandic', 'igbo', 'indonesian', 'irish', 'italian', 'japanese', 'javanese', 'kannada', 'kazakh', 'khmer', 'korean', 'kurdish (kurmanji)', 'kyrgyz', 'lao', 'latin', 'latvian', 'lithuanian', 'luxembourgish', 'macedonian', 'malagasy', 'malay', 'malayalam', 'maltese', 'maori', 'marathi', 'mongolian', 'myanmar (burmese)', 'nepali', 'norwegian', 'nyanja', 'pashto', 'persian', 'polish', 'portugese', 'punjabi', 'romanian', 'russian', 'samoan', 'scottish gaelic', 'serbian', 'sesotho', 'shona', 'sindhi', 'sinhala', 'slovak', 'slovenian', 'somali', 'spanish', 'sundanese', 'swahili', 'swedish', 'tajik', 'tamil', 'telugu', 'thai', 'turkish', 'ukrainian', 'urdu', 'uzbek', 'vietnamese', 'welsh', 'xhosa', 'yiddish', 'yoruba', 'zulu'];

class Translate extends Command {
    constructor (client) {
        super(client, {
            name: "translate",
            description: "Translates a text.",
            usage: "translate <from-language> <to-language> <text>",
            guildOnly: true,
            aliases: ["trans"]
        });
    }

    async run (message, args, level) {
        if (!args[0]) {
            return message.reply("please provide a language for me to translate from.");
        } else {
            if (!args[1]) {
                return message.reply("please provide a language for me to translate into.");
            } else {
                if (!args[2]) {
                    return message.reply("please provide a text for me to translate.");
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
                    args = args.join(' ').slice(2);
                    if (!langs.includes(fr) || !langs.includes(to)) {
                        return message.reply("language not found");
                    }
                    args = args.slice(fr.length);
                    args = args.slice(to.length);
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
    }
}

module.exports = Translate;