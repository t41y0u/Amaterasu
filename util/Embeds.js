const { RichEmbed } = require("discord.js");
const { post } = require("snekfetch");

async function embeds(type, message, args) { 
    const embed = new RichEmbed().setColor(0x00FFFF);
    switch (type) {
        case "noVoiceChannel": {
            embed.setAuthor("❌ Error").setDescription("You must be in a voice channel first!");
            break;
        }
        case "emptyQueue": {
            embed.setAuthor("❌ Error").setDescription("There is nothing playing!");
            break;
        }
        case "errorQueue": {
            embed.setAuthor("❌ Error").setDescription(`Queue index must be a value between 1 and ${args}.`);
            break;
        }
        case "errorVolume": {
            embed.setAuthor("❌ Error").setDescription("Volume must be a value between 0 and 100.");
            break;
        }
        case "errorTimeFormat": {
            embed.setAuthor("❌ Error").setDescription("Time format must be hh:mm:ss, mm:ss or ss (0 ≤ hh ≤ 24, 0 ≤ mm ≤ 60, 0 ≤ ss ≤ 60).");
            break;
        }
        case "currentVolume": {
            embed.setAuthor("🔊 Volume").setDescription(`Current volume is ${message.client.playlists.get(message.guild.id).connection.dispatcher.volumeLogarithmic * 100}%`);
            break;
        }
        case "volumeSet": {
            embed.setAuthor("🔊 Volume").setDescription(`Volume has been set to ${args[0]}%`);
            break;
        }
        case "queueEmbed": {
            let idx = 0;
            let out = message.client.playlists.get(message.guild.id).songs.map(song => `**${++idx}.** ${song.title}`).join("\n");
            if (out.length > 2048) {
                let idx = 0;
                const { body } = post("https://www.hastebin.com/documents").send(out);
                message.channel.send(`Queue was too long, uploaded it to hastebin: https://www.hastebin.com/${body.key}.txt`);
            } else {
                embed.setAuthor("📃 Queue").setDescription(out).setFooter(`Now playing: ${message.client.playlists.get(message.guild.id).songs[0].title}`);
            }
            break;
        }
        case "loopedEmbed": {
            embed.setAuthor("🔁 Looped").setDescription(`The song has been looped by ${message.member.displayName}`);
            break;
        }
        case "unloopedEmbed": {
            embed.setAuthor("🔁 Unlooped").setDescription(`The song has been unlooped by ${message.member.displayName}`);
            break;
        }
        case "nowPlaying": {
            const playingFor = message.client.playlists.get(message.guild.id).connection.dispatcher.time;
            embed.setAuthor("▶️ Now Playing").setDescription(`**${message.client.playlists.get(message.guild.id).songs[0].title}**\nHas been playing for **${formattedUptime(playingFor)}**`);
            break;
        }
        case "alreadyPaused": {
            embed.setAuthor("❌ Error").setDescription("The song is already paused!");
            break;
        }
        case "paused": {
            embed.setAuthor("⏸️ Paused").setDescription(`The song has been paused by ${message.member.displayName}.`);
            break;
        }
        case "alreadyResumed": {
            embed.setAuthor("❌ Error").setDescription("The song isn\"t paused!");
            break;
        }
        case "resumed": {
            embed.setAuthor("▶ Resumed").setDescription(`The song has been resume by ${message.member.displayName}.`);
            break;
        }
        case "stopped": {
            embed.setAuthor("⏹️ Stopped").setDescription(`The song has been stopped by ${message.member.displayName}.`);
            break;
        }
        case "skipped": {
            embed.setAuthor("⏩ Skipped").setDescription(`The song has been skipped by ${message.member.displayName}.`);
            break;
        }
        case "removed": {
            embed.setAuthor("✅️ Removed").setDescription(`Removed song: **${args[0]}** with index ${args[1]}.`);
            break;
        }
        case "shuffled": {
            embed.setAuthor("🔀️ Shuffle").setDescription(`Shuffled the queue.`);
            break;
        }
        case "noArgs": {
            embed.setAuthor("❌ Error").setDescription("Please provide me with some arguments!");
            break;
        }
        case "noPerms-CONNECT": {
            embed.setAuthor("❌ Error").setDescription("I cannot connect to your voice channel, make sure I have the proper permissions!");
            break;
        }
        case "noPerms-SPEAK": {
            embed.setAuthor("❌ Error").setDescription("I cannot speak in this voice channel, make sure I have the proper permissions!");
            break;
        }
        case "invalidEntry": {
            embed.setAuthor("❌ Error").setDescription("No or invalid value entered, cancelling video selection.");
            break;
        }
        case "noSearchResults": {
            embed.setAuthor("❌ Error").setDescription("I could not obtain any search results.");
            break; 
        }
        case "inactiveCall": {
            embed.setAuthor("❌ Error").setDescription("No one is in the call, leaving due to inactivity.");
            break;
        }
        case "noSongsFound": {
            embed.setAuthor("❌ Error").setDescription(`No songs found with the search term: ${args.join(" ")}.`);
            break;
        }
        case "noSongsShuffle": {
            embed.setAuthor("❌ Error").setDescription(`No songs left to shuffle.`);
            break;
        }
        case "summoned": {
            embed.setAuthor("✅️ Summoned").setDescription(`${message.client.user.tag} has been forced to join ${message.member.voiceChannel}.`);
            break;
        }
        case "unsummoned": {
            embed.setAuthor("❌ Unsummoned").setDescription(`${message.client.user.tag} has been forced to leave ${message.member.voiceChannel}.`);
            break;
        }
        case "notDJ": {
            embed.setAuthor("❌ Error").setDescription("You must be a DJ to use these commands, please ask an admin disable djonly if you wish to allow non-djs to use music commands.");
            break;
        }
        case "maxQueue": {
            embed.setAuthor("❌ Error").setDescription(`You have reached the max queue length of ${message.settings.maxqueuelength}, please ask an admin to increase the limit.`);
            break;
        } 
        case "APIError": {
            embed.setAuthor("❌ Error").setDescription("Sorry, an API error has occured. Please try again later.");
            break;
        }
        case "commonError": {
            embed.setAuthor("❌ Error").setDescription(args);
            break;
        }
        default: {
            embed.setAuthor("❌ Error").setDescription("Sorry, but an error has occured.");
        }
    }
    message.channel.send(embed);
}

module.exports = embeds;

function formattedUptime(ms) {
    const hr = Math.floor(ms / 1000 / 60 / 60);
    const mn = Math.floor(ms / 1000 / 60 % 60);
    const ss = Math.round(ms / 1000 % 60 % 60);
    const hours = `${hr === 0 ? '' : hr} ${hr === 1 ? 'hour,' : hr === 0 ? '' : 'hours,'}`;
    const minutes = `${mn === 0 ? '' : mn} ${mn === 1 ? 'minute and' : mn === 0 ? '' : 'minutes and'}`;
    const seconds = `${ss} ${ss === 1 ? 'second' : 'seconds'}`;
    return `${hours} ${minutes} ${seconds}`.trim();
}