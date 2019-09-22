const Command = require("../../util/Command.js");
const fetch = require("node-fetch");
const snekfetch = require("snekfetch");
const { RichEmbed } = require("discord.js");
const { TWITTER_API_KEY, TWITTER_SECRET } = process.env;

class Tweet extends Command {
    constructor(client) {
        super(client, {
            name: "tweet",
            description: "Returns the specified user's latest tweet.",
            category: "Information",
            usage: "tweet <user>",
            aliases: ["latesttweet", "latest-tweet"]
        });

        this.token = null;
    }

    async run(message, args, level) {
        const user = args[0];
        if (!user) return this.client.embed("commonError", message, "Please specify a Twitter user whose latest tweet you'd like to see.");
        if (!this.token) await this.fetchToken();
        const url = `https://api.twitter.com/1.1/users/show.json?screen_name=${user}`;
        const meta = { "Authorization": `Bearer ${this.token}` };
        fetch(url, { headers: meta })
            .then(res => res.json())
            .then(data => {
                const embed = new RichEmbed()
                    .setColor(0x00FFFF)
                    .setThumbnail(data.profile_image_url_https)
                    .setAuthor("Latest Tweet", "https://vgy.me/8tgKd0.png")
                    .setTitle(`${data.name} (@${data.screen_name})`)
                    .setURL(`https://twitter.com/${data.screen_name}`)
                    .setDescription(data.status ? data.status.text : "???");
                return message.channel.send({ embed });
            })
            .catch(err => {
                if (err.statusCode === 401) this.fetchToken();
                this.client.logger.error(err);
                return this.client.embed("APIError", message);
            });
    }

    async fetchToken() {
        const { body } = await snekfetch
            .post("https://api.twitter.com/oauth2/token")
            .set({
                Authorization: `Basic ${Buffer.from(`${TWITTER_API_KEY}:${TWITTER_SECRET}`).toString("base64")}`,
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            })
            .send("grant_type=client_credentials");
        this.token = body.access_token;
        return body;
    }
}

module.exports = Tweet;
