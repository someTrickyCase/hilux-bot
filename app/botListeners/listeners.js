const { getHash, updateHash } = require("../../hash/hashController");
const {
    postNewBitrixLead,
    updateBitrixLeadComment,
    getBitrixLeadStatus,
} = require("../../api/bitrxController.js");
const { botRepeatStartMessage } = require("../botMessages/messages");

const { switchToDefaultState } = require("../botState/defaultState.js");

function generatePostData(msg, type) {
    console.log(type);
    const postData = {
        fields: {
            SOURCE_ID: "12",
            SOURCE_DESCRIPTION: "hilux-tg-bot",
            NAME: msg.chat.first_name,
            IM: [
                {
                    TYPE_ID: "telegram",
                    VALUE: `Telegram username: @${msg.chat.username}`,
                },
            ],
        },
    };

    switch (type) {
        case "Оставил отзыв:":
            postData.fields.COMMENTS = `Оставил отзыв: ${msg.text}`;
            postData.fields.TITLE = `${msg.chat.first_name}  Отзыв`;
            break;
        case "Консультация:":
            postData.fields.COMMENTS = `Запросил консультацию: ${msg.text}`;
            postData.fields.TITLE = `${msg.chat.first_name}  Консультация`;
            break;
        case "Вопрос о товаре:":
            postData.fields.COMMENTS = `Задал вопрос по наличию: ${msg.text}`;
            postData.fields.TITLE = `${msg.chat.first_name}  Вопрос по наличию`;
            break;
    }

    console.log(postData);
    return postData;
}

async function botQueryListener(action, chatID, welcomeMessage, confirmMessage) {
    const actionMap = {
        testimonial: "Оставил отзыв:",
        consultation: "Консультация:",
        product: "Вопрос о товаре:",
    };
    try {
        this.removeListener("message");
        welcomeMessage.call(this, chatID);
        this.on("message", async (msg) => {
            const bitrixID = getHash(msg.from.username);
            if (bitrixID) {
                const leadUpdatingRes = await updateBitrixLeadComment(
                    bitrixID,
                    `${actionMap[action]} ${msg.text}`
                );
                if (leadUpdatingRes.status === 400) {
                    const res = await postNewBitrixLead(generatePostData(msg, actionMap[action]));
                    updateHash(msg.from.username, res.result);
                }
            } else {
                const res = await postNewBitrixLead(generatePostData(msg, actionMap[action]));
                updateHash(msg.from.username, res.result);
            }
            await confirmMessage.call(this, chatID);
            botRepeatStartMessage.call(this, chatID);
            switchToDefaultState(this);
        });
        return;
    } catch (error) {
        console.error(error);
    }
}

async function botOnOrderQueryListener(chatID, welcomeMessage) {
    try {
        this.removeListener("message");
        welcomeMessage.call(this, chatID);
        this.on("message", async (msg) => {
            const apiGeneratedText = await getBitrixLeadStatus(+msg.text);
            await this.sendMessage(chatID, apiGeneratedText);
            setTimeout(() => {
                botRepeatStartMessage.call(this, chatID);
            }, 700);
            switchToDefaultState(this);
        });
        return;
    } catch (error) {
        console.error(error);
        return;
    }
}

module.exports = {
    botQueryListener,
    botOnOrderQueryListener,
};
