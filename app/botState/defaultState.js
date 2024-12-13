const {
    botSendStartMessages,
    botSendOrderConfirmMessages,
    botRepeatStartMessage,
} = require("../../app/botMessages/messages");

const { updateHash } = require("../../hash/hashController.js");

function switchToDefaultState(bot) {
    bot.removeListener("message");

    bot.on("message", async (msg) => {
        const chatID = msg.chat.id;
        const text = msg.text;
        console.log(text);

        if (text === "/start") botSendStartMessages.call(bot, chatID);

        if (msg?.web_app_data?.data) {
            const bitrixID = msg?.web_app_data?.data.bitrixID;
            updateHash(msg.from.username, bitrixID);
            botSendOrderConfirmMessages.call(bot, chatID, bitrixID);
            botRepeatStartMessage.call(bot, chatID);
        }
    });
}

module.exports = {
    switchToDefaultState,
};
