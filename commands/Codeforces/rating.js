const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const plotly = require("plotly")(process.env.PLOTLY_USERNAME, process.env.PLOTLY_TOKEN);
const snekfetch = require("snekfetch");

async function get_user_rating(handle) {
    return await snekfetch.get("http://codeforces.com/api/user.rating?handle=" + handle);
};

function formatTime(time) {
    return time < 10 ? "0" + time : time;
}

function timeConverter(UNIX_timestamp){
    const a = new Date(UNIX_timestamp * 1000);
    const year = a.getFullYear();
    const month = formatTime(a.getMonth() + 1);
    const date = formatTime(a.getDate());
    const hour = formatTime(a.getHours());
    const min = formatTime(a.getMinutes());
    const sec = formatTime(a.getSeconds());
    const time = year + "-" + month + "-" + date + " " + hour + ":" + min + ":" + sec;
    return time;
}

function yearGap(first, last) {
    const a = new Date(first * 1000);
    const b = new Date(last * 1000);
    return b.getFullYear() - a.getFullYear();
}

class Rating extends Command {
    constructor (client) {
        super(client, {
            name: "rating",
            description: "Returns a plot of user rating.",
            category: "Codeforces",
            usage: "rating <handle>",
            guildOnly: true
        });
    }

    async run (message, args, level) {
        try {
            message.channel.startTyping();
            if (!args) {
                message.channel.stopTyping(true);
                return this.client.embed("commonError", message, "Please provide an existing Codeforces handle for me to search."); 
            }
            let rating;
            try {
                const { body } = await get_user_rating(args[0]);
                rating = body.result;
            } catch (err) {
                if (err.status && err.status === 400) {
                    return message.reply(err.body.comment);
                }
                console.error(err);
                message.channel.stopTyping(true);
                return this.client.embed("", message);
            }
            if (!rating.length) {
                message.channel.stopTyping(true);
                return this.client.embed("commonError", message, "This handle doesn't exist or the user with that handle hasn't participated in any rated contests."); 
            }
            const timestamps = [];
            rating.forEach(contest => {
                timestamps.push(timeConverter(contest.ratingUpdateTimeSeconds));
            });
            const yeargap = yearGap(rating[0].ratingUpdateTimeSeconds, rating[rating.length - 1].ratingUpdateTimeSeconds);
            const ratings = [];
            rating.forEach(contest => {
                ratings.push(contest.newRating);
            });
            const minRating = Math.min(...ratings);
            const maxRating = Math.max(...ratings);
            const data = [{
                type: "scatter",
                mode: "line",
                marker: { 
                    color: "rgb(0, 0, 0)",
                    symbol: "0"
                },
                x: timestamps,
                y: ratings
            }];
            const options = {
                layout: { 
                    title: `Rating graph of user <b>${args[0]}</b> on Codeforces`,
                    xaxis: {
                        linecolor: "black",
                        linewidth: 1,
                        mirror: true,
                        range: [timestamps[0], timestamps[timestamps.length - 1]],
                        showgrid: false,
                        ticks: "outside",
                        dtick: (yeargap >= 4 ? "M12" : "")
                    },
                    yaxis: {
                        linecolor: "black",
                        linewidth: 1,
                        mirror: true,
                        range: [Math.min(1000, minRating - 200), Math.max(2000, maxRating + 200)],
                        showgrid: false,
                        ticks: "outside",
                        tickmode: "array",
                        tickvals: [0, 1200, 1400, 1600, 1900, 2100, 2300, 2400, 2600, 3000],
                        ticktext: ["0", "1200", "1400", "1600", "1900", "2100", "2300", "2400", "2600", "3000"]
                    },
                    shapes: [{
                        type: "rect",
                        xref: "paper",
                        yref: "y",
                        x0: 0,
                        y0: -1e9,
                        x1: 1,
                        y1: 0,
                        fillcolor: "rgb(255, 255, 255)",
                        opacity: 0.4,
                        line: { width: 0 }
                    },{
                        type: "rect",
                        xref: "paper",
                        yref: "y",
                        x0: 0,
                        y0: 0,
                        x1: 1,
                        y1: 1200,
                        fillcolor: "rgb(204, 204, 204)",
                        opacity: 0.4,
                        line: { width: 0 }
                    },{
                        type: "rect",
                        xref: "paper",
                        yref: "y",
                        x0: 0,
                        y0: 1200,
                        x1: 1,
                        y1: 1400,
                        fillcolor: "rgb(119, 255, 119)",
                        opacity: 0.4,
                        line: { width: 0 }
                    },{
                        type: "rect",
                        xref: "paper",
                        yref: "y",
                        x0: 0,
                        y0: 1400,
                        x1: 1,
                        y1: 1600,
                        fillcolor: "rgb(119, 221, 187)",
                        opacity: 0.4,
                        line: { width: 0 }
                    },{
                        type: "rect",
                        xref: "paper",
                        yref: "y",
                        x0: 0,
                        y0: 1600,
                        x1: 1,
                        y1: 1900,
                        fillcolor: "rgb(170, 170, 255)",
                        opacity: 0.4,
                        line: { width: 0 }
                    },{
                        type: "rect",
                        xref: "paper",
                        yref: "y",
                        x0: 0,
                        y0: 1900,
                        x1: 1,
                        y1: 2100,
                        fillcolor: "rgb(255, 136, 255)",
                        opacity: 0.4,
                        line: { width: 0 }
                    },{
                        type: "rect",
                        xref: "paper",
                        yref: "y",
                        x0: 0,
                        y0: 2100,
                        x1: 1,
                        y1: 2300,
                        fillcolor: "rgb(255, 204, 136)",
                        opacity: 0.4,
                        line: { width: 0 }
                    },{
                        type: "rect",
                        xref: "paper",
                        yref: "y",
                        x0: 0,
                        y0: 2300,
                        x1: 1,
                        y1: 2400,
                        fillcolor: "rgb(255, 187, 85)",
                        opacity: 0.4,
                        line: { width: 0 }
                    },{
                        type: "rect",
                        xref: "paper",
                        yref: "y",
                        x0: 0,
                        y0: 2400,
                        x1: 1,
                        y1: 2600,
                        fillcolor: "rgb(255, 119, 119)",
                        opacity: 0.4,
                        line: { width: 0 }
                    },{
                        type: "rect",
                        xref: "paper",
                        yref: "y",
                        x0: 0,
                        y0: 2600,
                        x1: 1,
                        y1: 3000,
                        fillcolor: "rgb(255, 51, 51)",
                        opacity: 0.4,
                        line: { width: 0 }
                    },{
                        type: "rect",
                        xref: "paper",
                        yref: "y",
                        x0: 0,
                        y0: 3000,
                        x1: 1,
                        y1: 1e9,
                        fillcolor: "rgb(170, 0, 0)",
                        opacity: 0.4,
                        line: { width: 0 }
                    }],
                },
                filename: "user", 
                fileopt: "overwrite"
            };
            plotly.plot(data, options, function (err, res) { 
                if (err) {
                    console.error(err);
                    return this.client.embed("", message);
                }
                const image = res.url + ".png";
                message.channel.send({file: image});
                message.channel.stopTyping(true);
            });
        } catch(err) {
            console.error(err);
            message.stopTyping(true);
            return this.client.embed("commonError", message, "This handle doesn't exist or the user with that handle hasn't participated in any rated contests."); 
        }
    }
}

module.exports = Rating;