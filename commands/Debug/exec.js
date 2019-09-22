const Command = require("../../util/Command.js");
const exec = require("child_process").exec;

class Exec extends Command {
    constructor(client) {
        super(client, {
            name: "exec",
            description: "Evaluates arbitrary JavaScript.",
            category: "Debug",
            usage: "exec <expression>",
            permLevel: "Bot Owner"
        });
    }

    async run(message, args, level) {
        this.client.logger.warn("Exec command used");
        try {
            exec(`${args.join(" ")}`, (error, stdout) => {
                const response = (error || stdout);
                message.channel.send(`Ran command **\`${message.content.slice(6)}\`**:\n\`\`\`${response}\`\`\``, {split: true});
            });
        } catch (err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Exec;
