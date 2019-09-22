const { RichEmbed, Util } = require("discord.js");
const ytdl = require("ytdl-core");

const handleVideo = async (video, message, voiceChannel, playlist = false, seek = 0) => {
    const queue = message.client.playlists; 
    const song = {
        id: video.id,
        title: Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`,
        channel: video.channel.title,
        channelurl: `https://www.youtube.com/channel/${video.channel.id}`,
        durationh: video.duration.hours,
        durationm: video.duration.minutes,
        durations: video.duration.seconds,
        thumbnail: video.thumbnails.default.url,
        seek: seek,
        author: message.author.tag
    };
    if (!queue.has(message.guild.id)) {
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 100,
            playing: true,
            loop: false
        }; 
        queueConstruct.songs.push(song);
        queue.set(message.guild.id, queueConstruct);
        try {
            const connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(message.guild, queueConstruct.songs[0]);
        } catch (error) {
            queue.delete(message.guild.id);
            const embed = new RichEmbed()
                .setAuthor("❌ Error")
                .setDescription(`An error has occured: ${error}`)
                .setColor(0x00FFFF)
            return message.channel.send(embed);
        }
    } else {            
        if (queue.get(message.guild.id).songs.length >= message.settings.maxqueuelength) return message.client.embed("maxQueue", message);
        queue.get(message.guild.id).songs.push(song);
        if (playlist) return;
        else {
            const embed = new RichEmbed()
                .setAuthor("✅ Song added!")
                .setDescription(`**${song.title}** has been added to the queue!`)
                .setColor(0x00FFFF)
            return message.channel.send(embed);
        }
    }
    return;
};
  

function play(guild, song) {
    const queue = guild.client.playlists;
    const serverQueue = queue.get(guild.id);
    console.log(queue.get(guild.id).songs);
    if (!song) {
        queue.get(guild.id).voiceChannel.leave();
        const embed = new RichEmbed()
            .setAuthor("📃 Queue ended")
            .setDescription(`No song left in queue, leaving due to inactivity.`)
            .setColor(0x00FFFF);
        queue.get(guild.id).textChannel.send(embed);
        queue.delete(guild.id);
        guild.client.user.setActivity(`with the sun • a!help`);
        return;
    }
    console.log(queue.get(guild.id).songs);
    const dispatcher = queue.get(guild.id).connection.playStream(ytdl(song.url, { quality: "highest", filter: "audioonly" }), { seek: 0, volume: queue.get(guild.id).volume || 1 })
    .on("end", () => {
        if (!queue.get(guild.id).loop) queue.get(guild.id).songs.shift();
        setTimeout(() => { play(guild, queue.get(guild.id).songs[0]) }, 250);
    });
    console.log(queue.get(guild.id).songs);
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);   
    const songdurh = String(song.durationh).padStart(2, "0");
    const songdurm = String(song.durationm).padStart(2, "0");
    const songdurs = String(song.durations).padStart(2, "0");
    guild.client.user.setActivity(`🎶 | ${song.title}`, {type: "LISTENING"});
    const embed = new RichEmbed()
        .setAuthor("🎶 Now playing")
        .setTitle(`${song.title}`)
        .setURL(`${song.url}`)
        .setThumbnail(song.thumbnail)
        .addField("__Author__", `[${song.channel}](${song.channelurl})`, true)
        .addField("__Duration__",`${songdurh}:${songdurm}:${songdurs}`, true)
        .addField("__Requested by__", song.author, true)
        .setTimestamp()
        .setColor(0x00FFFF)
    if (!serverQueue.loop) return queue.get(guild.id).textChannel.send(embed);
}

module.exports = handleVideo; 