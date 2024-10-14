const fs = require("fs");

function getHash(username) {
    console.log("get hash");
    const data = JSON.parse(fs.readFileSync("data.txt"));
    console.log(data[username]);
    if (data[username]) return data[username];
}

function updateHash(username, id) {
    console.log("update Hash");
    const data = JSON.parse(fs.readFileSync("data.txt"));
    data[username] = id;
    fs.writeFileSync("data.txt", JSON.stringify(data));
}

module.exports = { getHash, updateHash };
