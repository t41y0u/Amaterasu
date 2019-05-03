const Command = require("../base/Command.js");
const Discord = require("discord.js");
const Jikan = require("jikan-node");
const mal = new Jikan();

class Manga extends Command {
    constructor (client) {
        super(client, {
            name: "manga",
            description: "Returns information about requested manga from MAL.",
            category: "Weeb",
            usage: "manga <name>",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        const search = args.join(" ");
        if (!search) {
            return message.reply(`please specify an manga to search!`)
        }
        function output(a) {
            var s = a[0].name;
            for (var i = 1; i < a.length; i++) {
                s += ', ' + a[i].name;
            }
            return s;
        }
        function anotheroutput(a) {
            var s = a[0];
            for (var i = 1; i < a.length; i++) {
                s += ', ' + a[0];
            }
            return s;
        }
        function andanotheroutput(s) {
            let i = s.lastIndexOf(' ', 2047);
            if (i > 2044) {
                i = s.lastIndexOf(' ', i - 1);
            }
            console.log(i);
            return (s.substring(0, i + 1) + "...");
        }
        mal.search("manga", search).then(info => {
            const id = info.results[0].mal_id;
            mal.findManga(id).then(result => {
                if (result.length === 0) {
                    return message.channel.send(`No results found for **${search}**!`);
                }
                const manga = result;
                const embed = new Discord.RichEmbed()
                    .setColor(0x00FFFF)
                    .setAuthor(`${manga.title}`, manga.image_url.replace(/<[^>]*>/g, ''))
                    .setTitle(`External link: https://myanimelist.net/manga/${id}`)
                    .setImage(manga.image_url.replace(/<[^>]*>/g, ''))
                    .setDescription(andanotheroutput(manga.synopsis.replace(/<[^>]*>/g, '')))
                    .addField('❯\u2000\Alternative Titles', `•\u2000\**English:** ${manga.title_english ? manga.title_english : manga.title}\n\•\u2000\**Synonyms:** ${manga.title_synonyms[0] ? anotheroutput(manga.title_synonyms) : '`N/A`'}\n\•\u2000\**Japanese:** ${manga.title_japanese}`)
                    .addField('❯\u2000\Information', `•\u2000\**Type:** ${manga.type ? manga.type : '`N/A`'}\n\•\u2000\**Volumes:** ${manga.volumes ? manga.volumes : '`N/A`'}\n\•\u2000\**Chapters:** ${manga.chapters ? manga.chapters : '`N/A`'}\n\•\u2000\**Status:** ${manga.status}\n\•\u2000\**Published:** ${manga.published.string}`)
                    .addField('❯\u2000\Credits', `•\u2000\**Authors:** ${manga.authors[0] ? output(manga.authors) : '`N/A`'}\n\•\u2000\**Serialization:** ${manga.serializations[0] ? output(manga.serializations) : '`N/A`'}\n\•\u2000\**Genres:** ${manga.genres[0] ? output(manga.genres) : '`N/A`'}`)
                    .addField('❯\u2000\Statistics', `•\u2000\**Score:** ${manga.score ? manga.score : '`N/A`'}\n\•\u2000\**Ranked:** #${manga.rank ? manga.rank : '`N/A`'}\n\•\u2000\**Popularity:** #${manga.popularity ? manga.popularity : '`N/A`'}\n\•\u2000\**Members:** ${manga.members ? manga.members : '`N/A`'}\n\•\u2000\**Favorites:** ${manga.favorites ? manga.favorites : '`N/A`'}`)
                return message.channel.send({embed});
            }).catch(err => {
                console.log(err);
                message.reply("there was an error processing your request. Please try again later.");
            });
        }).catch(err => {
            console.log(err);
            message.reply("there was an error processing your request. Please try again later.");
        });
    }
}

module.exports = Manga;
