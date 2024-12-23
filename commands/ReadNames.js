module.exports = {
    name: 'ReadNames',
    aliases: ['read', 'readnames', 'readname', 'data'],
    description: 'Information about the arguments provided.',
    args: true,
    usage: '<character> <move>',
    execute(message, args, char, moveName, data) {
        //message.channel.send(`${message.author}, you asked for data on ${char}\nHere is that data:\n`);
        //message.channel.send(data);
        if (data["Notes"] == "") {
            data["Notes"] = "None"
        }

        if (data["Visual"] == "") {
            data["Visual"] = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png";
        }

        for (var x of Object.keys(data)) {
            if (data[x] == "" || data[x] == null) {
                data[x] = "N/A";
            }

            data[x] = extractNumberWithText(data[x]);

        }

        const embed = {
            "title": `${char} - ${moveName}`,
            "color": 8662508,
            "image": {
                "url": data["anim gif-src"]
            },
            "author": {
                "name": "Rivals Frame Bot",
                "url": "https://rivalsframedata.com/",
                "icon_url": "https://i.imgur.com/WBVF6DU.png"
            },
            "footer": {
                "icon_url": "https://cdn2.iconfinder.com/data/icons/minimalism/512/twitter.png",
                "text": `Bot by @clamtime`
            },
            "fields": [
                {
                    "name": "**Notes**",
                    "value": "```" + extractNumberWithText(data["notes"]) + "```"
                },
                {
                    "name": "**Active Frames**",
                    "value": data["Active"],
                    "inline": true
                },
                {
                    "name": "**EndLag**",
                    "value": data["Recovery"],
                    "inline": true
                },
                {
                    "name": "**FaF**",
                    "value": data["FaF"],
                    "inline": true
                },
                {
                    "name": "**Damage**",
                    "value": data["Damage"],
                    "inline": true
                },
                {
                    "name": "**Shield Stun**",
                    "value": data["Shield Stun"],
                    "inline": true
                },
                {
                    "name": "**Sheild Advantage**",
                    "value": data["shield advantage"],
                    "inline": true
                }
            ]
        };
        message.channel.send({ embed });
    },
};

function extractNumberWithText(value) {
    // Regular expression to match numbers or numbers with parentheses
    const regex = /[0-9]+\([^)]*\)|[0-9]+/g;
    const matches = value.match(regex); // Find all matches

    if (matches) {
        return matches.join(''); // Join matches if multiple found
    }
    return value; // Return the original value if no match
}

function isAlphanumeric(str) {
    // Regular expression to check if string contains only alphanumeric characters
    const regex = /[A-Za-z0-9]+.*[0-9]+/;
    return regex.test(str); // Returns true if the string matches, false otherwise
}