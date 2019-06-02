const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const Dictionary = require("oxford-dictionary");

const config = {
    app_id : process.env.OXFORD_APP_ID,
    app_key : process.env.OXFORD_APP_KEY,
    source_lang : "en"
};
  
const dict = new Dictionary(config);

class Oxford extends Command {
    constructor(client) {
        super(client, {
            name: "oxford",
            description: "Looks up Oxford Dictionary for definitions, pronounciations, synonyms, ... and more.",
            category: "Information",
            usage: "oxford <term>",
            aliases: ["oxf"]
        });
    }

    async run(message, args, level) {
        function jsonHandler(data, index1, index2) {
            const provider = data.metadata.provider;
            if (!data.results[0].lexicalEntries[index1]) {
                return { text: "oh no" };
            }
            const lexicalEntry = data.results[0].lexicalEntries[index1];
            const text = lexicalEntry.text;
            const category = lexicalEntry.lexicalCategory;
            const entry = lexicalEntry.entries[0];
            let etymology = "None";
            if (entry.etymologies) {
                etymology = "1. " + entry.etymologies[0];
                for (let i = 1; i < entry.etymologies.length; i++) {
                    etymology += "\n" + (i + 1) + ". " + entry.etymologies[i];
                }
            }
            if (!entry.senses[index2]) {
                return { text: "oh no" };
            }
            const sense = entry.senses[index2];
            let definition = sense.definitions[0];
            if (sense.definitions.length > 1) {
                sense = "1. " + sense.definitions[0];
                for (let i = 1; i < sense.definitions.length; i++) {
                    sense += "\n" + (i + 1) + ". " + sense.definitions[i];
                }
            }
            let domain = "None";
            if (sense.domains) {
                domain = sense.domains[0];
                if (sense.domains.length > 1) {
                    domain = "1. " + sense.domains[0];
                    for (let i = 1; i < sense.domains.length; i++) {
                        domain += "\n" + (i + 1) + ". " + sense.domains[i];
                    }
                }
            }
            let example = "None";
            if (sense.examples) {
                example = sense.examples[0].text;
                if (sense.registers) {
                    example += " (" + sense.registers[0];
                    for (let i = 1; i < sense.registers.length; i++) {
                        example += ", " + sense.registers[i];
                    }
                    example += ")";
                }
                if (sense.examples.length > 1) {
                    example = "1. " + sense.examples[0].text;
                    if (sense.registers) {
                        example += " (" + sense.registers[0];
                        for (let i = 1; i < sense.registers.length; i++) {
                            example += ", " + sense.registers[i];
                        }
                        example += ")";
                    }
                    for (let i = 1; i < sense.examples.lenth; i++) {
                        example += "\n" + (i + 1) + ". " + sense.examples[i].text;
                        if (sense.registers) {
                            example += " (" + sense.registers[i];
                            for (let j = 1; j < sense.registers.length; j++) {
                                example += ", " + sense.registers[j];
                            }
                            example += ")";
                        }
                    }
                }
            }
            let pronunciation = "None";
            let phonetic = "None";
            let dialect = "None";
            if (lexicalEntry.pronunciations) {
                pronunciation = lexicalEntry.pronunciations[0].audioFile;
                phonetic = lexicalEntry.pronunciations[0].phoneticSpelling;
                dialect = lexicalEntry.pronunciations[0].dialects[0];
            }
            return {
                text: text, 
                category: category,
                provider: provider,
                etymologies: etymology,
                domains: domain,
                definitions: definition,
                examples: example,
                pronunciations: pronunciation,
                phonetics: phonetic,
                dialects: dialect
            };
        }
        function queryHandler(res, idx1, idx2) {
            const data = jsonHandler(res, idx1, idx2);
            if (data.text === "oh no") {
                return "rip";
            }
            const embed = new RichEmbed()
                .setColor(0x00FFFF)
                .setTitle(`Showing definition for "${data.text}"`)
                .setDescription(`[${data.category}] ${data.definitions}`)
                .addField("__Etymologies__", data.etymologies)
                .addField("__Domains__", data.domains)
                .addField("__Examples__", data.examples)
                .addField(`__Pronunciations ${data.dialects === "None" ? "" : "(" + data.dialects + ")"}__`, `${data.pronunciations ? `[/${data.phonetics}/](${data.pronunciations})` : data.phonetics}`)
                .setFooter(`Definitions provided by ${data.provider}`)
            return embed;
        }
        try {
            const term = args.join(" ");
            if (!term) return this.client.embed("commonError", message, "Please provide a query for me to search from Oxford Dictionary's database.");
            const author = message.author;
            const lookup = dict.find(term)
                .then(async res => {
                    if (!res.results) {
                        return this.client.embed("commonError", message, `No definitions found for ${term}`);
                    }
                    let idx1 = 0, idx2 = 0;
                    let embed = queryHandler(res, idx1, idx2);
                    const msg = await message.channel.send({embed});
                    msg.react("◀").then(() => msg.react("▶")).then(() => msg.react("🔼")).then(() => msg.react("🔽"))
                    const collector = msg.createReactionCollector((reaction, user) => ["◀", "▶", "🔼", "🔽"].includes(reaction.emoji.name) && user === author);
                    collector.on('collect', async (reaction) => {
                        if (reaction.emoji.name === "◀") {
                            idx1--;
                        } else if (reaction.emoji.name === "▶") {
                            idx1++;
                        } else if (reaction.emoji.name === "🔼") {
                            idx2--;
                        } else if (reaction.emoji.name === "🔽") {
                            idx2++;
                        }
                        if (queryHandler(res, idx1, idx2) === "rip") {
                            if (reaction.emoji.name === "◀") {
                                idx1++;
                            } else if (reaction.emoji.name === "▶") {
                                idx1--;
                            } else if (reaction.emoji.name === "🔼") {
                                idx2++;
                            } else if (reaction.emoji.name === "🔽") {
                                idx2--;
                            }
                        } else {
                            embed = queryHandler(res, idx1, idx2);
                            msg.edit({embed});
                        }
                        await reaction.remove(reaction.users.filter(user => user !== this.client.user).first());
                    });
                })
                .catch(err => {
                    this.client.logger.error(err.stack);
                    return this.client.embed("APIError", message);
                });
        } catch (err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Oxford;