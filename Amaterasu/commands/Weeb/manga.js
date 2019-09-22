const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
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
        try {
            const search = args.join(" ");
            if (!search) return this.client.embed("commonError", message, "Please specify a manga to search!")
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
                    s += ', ' + a[i];
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
                    const embed = new RichEmbed()
                        .setColor(0x00FFFF)
                        .setAuthor(`${manga.title}`, manga.image_url.replace(/<[^>]*>/g, ''))
                        .setTitle(`External link: https://myanimelist.net/manga/${id}`)
                        .setImage(manga.image_url.replace(/<[^>]*>/g, ''))
                        .setDescription(manga.synopsis ? (manga.synopsis.length <= 2048 ? manga.synopsis.replace(/<[^>]*>/g, '') : andanotheroutput(manga.synopsis.replace(/<[^>]*>/g, ''))) : '`N/A`')
                        .addField('❯ Alternative Titles', `• **English:** ${manga.title_english ? manga.title_english : manga.title}\n• **Synonyms:** ${manga.title_synonyms[0] ? anotheroutput(manga.title_synonyms) : '`N/A`'}\n• **Japanese:** ${manga.title_japanese}`)
                        .addField('❯ Information', `• **Type:** ${manga.type ? manga.type : '`N/A`'}\n• **Volumes:** ${manga.volumes ? manga.volumes : '`N/A`'}\n• **Chapters:** ${manga.chapters ? manga.chapters : '`N/A`'}\n• **Status:** ${manga.status}\n• **Published:** ${manga.published.string}`)
                        .addField('❯ Credits', `• **Authors:** ${manga.authors[0] ? output(manga.authors) : '`N/A`'}\n• **Serialization:** ${manga.serializations[0] ? output(manga.serializations) : '`N/A`'}\n• **Genres:** ${manga.genres[0] ? output(manga.genres) : '`N/A`'}`)
                        .addField('❯ Statistics', `• **Score:** ${manga.score ? manga.score : '`N/A`'}\n• **Ranked:** #${manga.rank ? manga.rank : '`N/A`'}\n• **Popularity:** #${manga.popularity ? manga.popularity : '`N/A`'}\n• **Members:** ${manga.members ? manga.members : '`N/A`'}\n• **Favorites:** ${manga.favorites ? manga.favorites : '`N/A`'}`)
                    return message.channel.send({embed});
                }).catch(err => {
                    this.client.logger.error(err.stack);
                    return this.client.embed("APIError", message);
                });
            }).catch(err => {
                this.client.logger.error(err.stack);
                return this.client.embed("APIError", message);
            });
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Manga;
