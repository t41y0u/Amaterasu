const Command = require("../../util/Command.js");
const fetch = require("node-fetch");

class Expand extends Command {
    constructor(client) {
        super(client, {
            name: "expand",
            description: "Makes the specified text T H I C C",
            category: "Fun",
            usage: "expand <text>"
        });
    }

    async run(message, args, level) { 
        const text = encodeURIComponent(args.join(" "));
        if (!text) this.client.embed("commonError", message, "Please provide some text for me to E X P A N D.");
        fetch(`http://artii.herokuapp.com/make?text=${text}`)
            .then(res => res.text())
            .then(body => {
                if (body.length > 2000) return this.client.embed("commonError", message, "Unfortunately, the specified text is too long. Please try again with something a little shorter.")
                return message.channel.send(body, { code: "fix" });
            })
            .catch(err => {
                this.client.logger.error(err.stack);
                return this.client.embed("APIError", message);
            });
    }
}

module.exports = Expand;
