const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const request = require("superagent");
const cheerio = require("cheerio");

class NHentai extends Command {
    constructor (client) {
        super(client, {
            name: "nhentai",
            description: "Searches doujin with specified code from nhentai.",
            category: "Weeb",
            usage: "nhentai <code>",
            guildOnly: true
        });
    }

    async run (message, args, level) {
        function getDoujin(code) {
            const id = code.replace(/(https?:\/\/nhentai\.net\/g\/)(\d+)\/?.*/, "$2");
            return new Promise((resolve, reject) => {
                request
                    .get("https://nhentai.net/g/" + id + "/")
                    .then(res => {
                        const $ = cheerio.load(res.text)
                        let details = {}
                        $(".tag-container.field-name").text().split("\n").map(string => string.trim()).filter(u => u).map((tag, i, tags) => {
                            if (tag.endsWith(":") && !tags[i + 1].endsWith(":")) { 
                                details[tag.substring(0, tag.length - 1).toLowerCase()] = tags[i + 1].replace(/(\([0-9,]+\))([a-zA-Z])/g, "$1 $2").split(/(?<=\))\s(?=[a-zA-Z])/); 
                            }
                        })
                        const title = $("#info").find("h1").text();
                        const nativeTitle = $("#info").find("h2").text();
                        const thumbnails = Object.entries($(".gallerythumb").find("img")).map(image => {
                            return image[1].attribs ? image[1].attribs["data-src"] : null;
                        }).filter(link => link)
                        const images = Object.entries($(".gallerythumb").find("img")).map(image => {
                            return image[1].attribs ? image[1].attribs["data-src"].replace(/t(\.(jpg|png))/, "$1").replace("t.nhentai", "i.nhentai") : null;
                        }).filter(link => link);
                        const link = `https://nhentai.net/g/${id}/`
                        resolve({ title, nativeTitle, details, pages: images, thumbnails, link })
                    })
                    .catch(reject)
            })
        }
        async function getInfo(message, author, bot, code, page) {
            let info = new RichEmbed().setColor(0x00FFFF)
            let failed = "false";
            await getDoujin(code).then(async details => {
                if (!details) {
                    failed = "true";
                    return;
                }
                info.setAuthor(details.title, "https://pbs.twimg.com/profile_images/733172726731415552/8P68F-_I_400x400.jpg", details.link)
                    .setThumbnail(details.pages[0])
                    .setFooter(`Code: ${code}`)
                    .setTimestamp()
                Object.entries(details.details).map(tagPair => {
                    const tagString = tagPair[1].join(", ");
                    info.addField(tagPair[0].toProperCase(), tagString);
                })
                info.addField("Pages", details.pages.length);
                if (failed === "true") return;
                await message.clearReactions();
                await message.edit(info);
            })
            await message.react("⬅").then(() => message.react("🖼")).then(() => message.react("➡"));
            const collector = message.createReactionCollector((reaction, user) => ["⬅", "🖼", "➡"].includes(reaction.emoji.name) && user === author);
            collector.on("collect", async (reaction) => {
                if (reaction.emoji.name === "⬅") {
                    code = Number(code);
                    code--;
                    code = code.toString();
                } else if (reaction.emoji.name === "🖼") {
                    getImage(message, author, bot, code, page);
                } else {
                    code = Number(code);
                    code++;
                    code = code.toString();
                }
                info = new RichEmbed().setColor(0x00FFFF)
                failed = "false";
                getDoujin(code).then(async details => {
                    if (!details) {
                        failed = "true";
                        return;
                    }
                    info.setAuthor(details.title, "https://pbs.twimg.com/profile_images/733172726731415552/8P68F-_I_400x400.jpg", details.link)
                        .setThumbnail(details.pages[0])
                        .setFooter(`Code: ${code}`)
                        .setTimestamp()
                    Object.entries(details.details).map(tagPair => {
                        const tagString = tagPair[1].join(", ");
                        info.addField(tagPair[0].toProperCase(), tagString);
                    })
                    info.addField("Pages", details.pages.length);
                    if (failed === "true") return;
                    await message.edit(info);
                })
                await reaction.remove(reaction.users.filter(user => user !== bot).first());
            });
        }
        async function getImage(message, author, bot, code, page) {
            let image = new RichEmbed().setColor(0x00FFFF)
            let failed = "false";
            await getDoujin(code).then(async details => {
                if (!details) {
                    failed = "true";
                    return;
                }
                if (Number(page) < 0 || Number(page) > details.pages.length - 1 || isNaN(Number(page))) return;
                image.setImage(details.pages[page]).setFooter(`Page ${page + 1} of ${details.pages.length}`).setTimestamp()
                if (failed === "true") return;
                await message.clearReactions();
                await message.edit(image);
            })
            await message.react("◀").then(() => message.react("❌")).then(() => message.react("▶"));
            const collector = message.createReactionCollector((reaction, user) => ["◀", "❌", "▶"].includes(reaction.emoji.name) && user === author);
            collector.on("collect", async (reaction) => {
                if (reaction.emoji.name === "◀") {
                    page--;
                } else if (reaction.emoji.name === "❌") {
                    getInfo(message, author, bot, code, page);
                } else {
                    page++;
                }
                image = new RichEmbed().setColor(0x00FFFF)
                getDoujin(code).then(async details => {
                    if (!details) {
                        failed = "true";
                        return;
                    }
                    if (Number(page) < 0 || Number(page) > details.pages.length - 1 || isNaN(Number(page))) {
                        if (reaction.emoji.name === "◀") {
                            page++;
                        } else if (reaction.emoji.name === "▶") {
                            page--;
                        }
                        return;
                    }
                    image.setImage(details.pages[page]).setFooter(`Page ${page + 1} of ${details.pages.length}`).setTimestamp()
                    if (failed === "true") return;
                    await message.edit(image);
                })
                await reaction.remove(reaction.users.filter(user => user !== bot).first());
            });
        } 
        try {
            let error = new RichEmbed().setColor(0x00FFFF)
            if (!message.channel.nsfw) {
                error.setAuthor("🔞 NSFW").setDescription("Cannot display NSFW content in a SFW channel.");
                return message.channel.send(error);
            }
            const code = args[0], page = 0, author = message.author, bot = this.client.user;
            const msg = await message.channel.send("Fetching data ...");
            try {
                getDoujin(code).then(async details => { if (!details) return; })
            } catch (err) {
                error.setAuthor("❌ Error").setDescription(`No contents found with the code: ${code}.`);
                return msg.edit(error);
            }
            getInfo(msg, author, bot, code, page);
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("APIError", message);
        }
    }
}

module.exports = NHentai;