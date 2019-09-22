const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const fetch = require("node-fetch");
const moment = require("moment");

class GitHub extends Command {
    constructor(client) {
      super(client, {
        name: "github",
        description: "Returns information about the specified GitHub repository.",
        category: "Information",
        usage: "github <repo-owner> <repo-name>",
        aliases: ["repo", "repo-info", "repository-info"]
      });
    }

    async run(message, args, level, settings, texts) {
        let owner = args[0];
        if (!owner) return this.client.embed("commonError", message, "Please provide the repository owner's username or organisation name.");
        else owner = encodeURIComponent(args[0]);
        let repo = args[1];
        if (!repo) return this.client.embed("commonError", message, "Please provide a repository name to search for.");
        else repo = encodeURIComponent(args[1]);
        fetch(`https://api.github.com/repos/${owner}/${repo}`)
            .then(res => res.json())
            .then(data => {
                const embed = new RichEmbed()
                    .setColor(0)
                    .setThumbnail(data.owner.avatar_url)
                    .setAuthor("GitHub", "https://vgy.me/B4CvF1.png")
                    .setTitle(data.full_name)
                    .setURL(data.html_url)
                    .setDescription(data.description ? data.description : "[No description set]")
                    .addField("❯\u2000\Created", moment.utc(data.created_at).format("DD/MM/YYYY HH:mm:ss"), true)
                    .addField("❯\u2000\Last updated", moment.utc(data.updated_at, "YYYYMMDD").fromNow(), true)
                    .addField("❯\u2000\Stars", data.stargazers_count, true)
                    .addField("❯\u2000\Forks", data.forks, true)
                    .addField("❯\u2000\Issues", data.open_issues, true)
                    .addField("❯\u2000\Language", data.language || "No language", true)
                    .addField("❯\u2000\License", data.license ? data.license.spdx_id : "Unlicensed", true)
                    .addField("❯\u2000\Archived?", data.archived.toString().toProperCase() === "True" ? "Yes" : "No", true)
                    .setFooter("All times are UTC")
                    .setTimestamp();
                return message.channel.send({ embed });
            })
            .catch(err => {
                this.client.logger.error(err.stack);
                return this.client.embed("APIError", message);
            });
    }
}

module.exports = GitHub;
