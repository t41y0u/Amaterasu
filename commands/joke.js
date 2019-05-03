const Command = require("../base/Command.js");
const oneLinerJoke = require("one-liner-joke");

class Joke extends Command {
    constructor (client) {
        super(client, {
            name: "joke",
            description: "Sends a one-liner-joke.",
            usage: "joke",
            guildOnly: true,
            aliases: ["jk"]
        });
    }

    async run (message, args, level) {
        const joke = oneLinerJoke.getRandomJoke();
        const msg = await message.channel.send({
            embed:{
                color: 0x00FFFF,
                title: `${joke.body}`
            }
        });
        msg.react('😂');
    }
}

module.exports = Joke;