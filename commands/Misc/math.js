const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const math = require("mathjs");

class MathC extends Command {
    constructor (client) {
        super(client, {
            name: "math",
            description: "Does some math.",
            category: "Misc",
            usage: "math <help|calc <expression>|pi|prime <number>>",
            guildOnly: true
        });
    }

    async run (message, args, level) {
        try {
            if (args[0] === "help") {
                let embed = new RichEmbed()
                    .setColor(0x00FFFF)
                    .setTitle("📜 Help")
                    .setDescription("❯ a!math help: Displays this message.\n❯ a!math calc <expression>: Calculates the given expression.\n❯ a!math pi: Pi\n❯ a!math prime <number>: Checks primality of the given number.\n\n❯ The syntaxes for this command can be viewed [here](https://web.archive.org/web/20181007235907/https://mathjs.org/docs/expressions/syntax.html)")
                message.channel.send(embed);
            } else if (args[0] === "calc") {
                const exp = args.slice(1).join("");
                if (!exp) return this.client.embed("commonError", message, "Please provide a valid expression");
                if (exp.length > 1010) return this.client.embed("commonError", message, "Expression is too long!");
                if (exp.includes("°")) exp = exp.replace(/°/g, "deg");
                let result;
                try {
                    result = math.eval(exp);
                } catch(err) {
                    console.log('Failed math calculation ' + exp.content + '\nError: ' + err.stack);
                    return this.client.embed("commonError", message, "An error occured while evaluating the math expression.");
                } finally {
                    if (isNaN(parseFloat(result))) {
                        message.reply("Invalid Calculation Expression");
                    } else {
                        let embed = new RichEmbed()
                            .setColor(0x00FFFF)
                            .setTitle(`Evaluated in ${Math.round(this.client.ping)}ms`)
                            .addField(":inbox_tray: Input", `\`\`\`js\n${exp}\n\`\`\``)
                            .addField(":outbox_tray: Output", `\`\`\`js\n${result}\n\`\`\``)
                        message.channel.send(embed);
                    }
                }
            } else if (args[0] === "pi") {
                message.channel.send(`π = **${Math.PI}**...`);
            } else if (args[0] === "prime" || args[0] === "isprime") {
                const n = parseInt(args[1]);
                if (!n) return this.client.embed("lackVar", message, "check primality");
                const isPrime = n => {
                    if (isNaN(n) || !isFinite(n) || n % 1 || n < 2) return false;
                    if (n % 2 == 0) return (n == 2);
                    if (n % 3 == 0) return (n == 3);
                    const m = Math.sqrt(n);
                    for (let i = 5; i <= m; i += 6) {
                        if (n % i == 0) return false;
                        if (n % (i + 2) == 0) return false;
                    }
                    return true;
                };
                if (isPrime(n) === true) {
                    message.channel.send(`✅ **${n}** is a prime.`);
                } else {
                    message.channel.send(`❌ **${n}** is not a prime.`);
                }
            } else {
                return this.client.embed("lackVar", message, "work on");
            }
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed(message);
        }
    }
}

module.exports = MathC;
