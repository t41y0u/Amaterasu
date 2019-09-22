const Command = require("../../util/Command.js");
const fetch = require("node-fetch");

class FakeTweet extends Command {
    constructor(client) {
        super(client, {
            name: "faketweet",
            description: "Creates a fake tweet.",
            category: "Image",
            usage: "faketweet <username> <message>",
            aliases: ["fake-tweet"]
        });
    }

    async run(message, args, level) {
        let user = args[0];
        let text = args.slice(1).join(" ") || undefined;
        if (!user) return this.client.embed("commonError", message, "You must provide a Twitter username to have as the author of the tweet.");
        if (user.startsWith("@")) user = args[0].slice(1);
        const type = user.toLowerCase() === "realdonaldtrump" ? "trumptweet" : "tweet";
        const u = user.startsWith("@") ? user.slice(1) : user;
        if (!text) return this.client.embed("commonError", message, "Please provide something for me to faketweet."); 
        message.channel.startTyping();
        fetch(`https://nekobot.xyz/api/imagegen?type=${type}&username=${u}&text=${encodeURIComponent(text)}`)
            .then(res => res.json())
            .then(data => message.channel.send({ file: data.message }))
            .catch(err => {
                this.client.logger.error(err.stack);
                message.channel.stopTyping(true);
                return this.client.embed("APIError", message);
            });
        message.channel.stopTyping(true);
    }
}

module.exports = FakeTweet;
