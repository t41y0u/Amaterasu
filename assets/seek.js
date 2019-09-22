const Command = require("../../util/Command.js");
const { RichEmbed, Util } = require("discord.js");
const ytapi = require("simple-youtube-api"); 
const handleVideo = require("../../util/MusicHandling");
const youtube = new ytapi(process.env.GOOGLE_API_KEY); 

const regex = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/g;

class Seek extends Command {
    constructor (client) {
        super(client, {
            name: "seek",
            description: "Seeks to a specific timestamp in the audio.",
            category: "Music",
            usage: "seek <time>",
            guildOnly: true
        });
    }

    async run (message, args, level) {
        try {
            if (message.settings.djonly && !message.member.roles.some(c => c.name.toLowerCase() === message.settings.djrole.toLowerCase())) return message.client.embed("notDJ", message);
            if (!args.length) return this.client.embed("lackVar", message, "seek to");
            const voiceChannel = message.member.voiceChannel;
            if (!voiceChannel) return this.client.embed("noVoiceChannel", message);
            const time = args[0].replace(regex,"$1 $2 $3").split(" ");
            if (time[0].includes(":")) return this.client.embed("errorTimeFormat", message);
            const hh = (time[0] ? Number(time[0]) : 0);
            const mm = (time[1] ? Number(time[1]) : 0);
            const ss = (time[2] ? Number(time[2]) : 0);
            const ms = hh * 3600 * 1000 + mm * 60 * 1000 + ss * 1000;
            const video = await youtube.getVideoByID(message.guild.client.playlists.get(message.guild.id).songs[0].id);
            handleVideo(video, message, voiceChannel, false, ms);
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Seek;