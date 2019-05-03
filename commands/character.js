const Command = require("../base/Command.js");
const Discord = require("discord.js");
const Jikan = require("jikan-node");
const mal = new Jikan();

class Character extends Command {
    constructor (client) {
        super(client, {
            name: "character",
            description: "Returns information about requested character from MAL.",
            category: "Weeb",
            usage: "character <name>",
            guildOnly: true,
            aliases: ["char"]
        });
    }

    async run (message, args, level) {
        const search = args.join(" ");
        if (!search) {
            return message.reply(`please specify an character to search!`)
        }
        function output(a) {
            var s = '[' + a[0].name + '](' + a[0].url.replace(/<[^>]*>/g, '') + ')';
            for (var i = 1; i < a.length; i++) {
                s += ', [' + a[i].name + '](' + a[i].url.replace(/<[^>]*>/g, '') + ')';
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
        function yetanotheroutput(a) {
            var s = "";
            for (var i = 0; i < a.length; i++) {
                if (s.length + ('\•\u2000\[' + a[i].name + '](' + a[i].url.replace(/<[^>]*>/g, '') + ')\n').length > 1024) {
                    return s;
                }
                s += '\•\u2000\[' + a[i].name + '](' + a[i].url.replace(/<[^>]*>/g, '') + ')\n';
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
        mal.search("character", search).then(info => {
            const id = info.results[0].mal_id;
            mal.findCharacter(id).then(result => {
                if (result.length === 0) {
                    return message.channel.send(`No results found for **${search}**!`);
                }
                const character = result;
                const embed = new Discord.RichEmbed()
                    .setColor(0x00FFFF)
                    .setAuthor(`${character.name}`, character.image_url.replace(/<[^>]*>/g, ''))
                    .setTitle(`External link: https://myanimelist.net/character/${id}`)
                    .setImage(character.image_url.replace(/<[^>]*>/g, ''))
                    .setDescription(character.about.length > 2048 ? andanotheroutput(character.about) : character.about)
                    .addField('❯\u2000\Alternative Names', `•\u2000\**Kanji:** ${character.name_kanji}\n\•\u2000\**Nicknames:** ${character.nicknames[0] ? anotheroutput(character.nicknames) : '`N/A`'}`)
                    .addField('❯\u2000\Information', `•\u2000\**Voice Actors:** ${character.voice_actors[0] ? output(character.voice_actors) : '`N/A`'}\n\•\u2000\**Favorites:** ${character.member_favorites ? character.member_favorites : '`N/A`'}`)
                    .addField('❯\u2000\Animeography', `${yetanotheroutput(character.animeography) ? yetanotheroutput(character.animeography) : 'None'}`)
                    .addField('❯\u2000\Mangaography', `${yetanotheroutput(character.mangaography) ? yetanotheroutput(character.mangaography) : 'None'}`)
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

module.exports = Character;
