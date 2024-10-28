require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

const { updateHash } = require("./hash/hashController.js");

const token = process.env.TOKEN;
const bot = new TelegramBot(token, {
    polling: true,
});

const {
    botSendStartMessages,
    botSendOrderConfirmMessages,
    botRepeatStartMessage,
    botSendTestimonialWelcomeMessage,
    botSendTestimonialConfirmMessage,
    botSendConsultationWelcomeMessage,
    botSendConsultationConfirmMessage,
    botSendProductWelcomeMessage,
    botSendProductConfirmMessage,
    botSendOrderWelcomeMessage,
    botSendPayingFAQ,
    botSendDeliveryFAQ,
    botSendContactsFAQ,
    botSendVehicleCustomizationFAQ,
} = require("./app/botMessages/messages.js");
const { botQueryListener, botOnOrderQueryListener } = require("./app/botListeners/listeners.js");

bot.on("message", async (msg) => {
    const chatID = msg.chat.id;
    const text = msg.text;

    if (text === "/start") botSendStartMessages.call(bot, chatID);

    if (msg?.web_app_data?.data) {
        const bitrixID = msg?.web_app_data?.data.bitrixID;
        updateHash(msg.from.username, bitrixID);
        botSendOrderConfirmMessages.call(bot, chatID, bitrixID);
        botRepeatStartMessage.call(bot, chatID);
    }
});

bot.on("callback_query", async (query) => {
    const chatID = query.message.chat.id;
    switch (query.data) {
        case "order":
            botOnOrderQueryListener.call(bot, chatID, botSendOrderWelcomeMessage);
            break;
        case "product":
            botQueryListener.call(
                bot,
                "product",
                chatID,
                botSendProductWelcomeMessage,
                botSendProductConfirmMessage
            );
            break;
        case "consultation":
            botQueryListener.call(
                bot,
                "consultation",
                chatID,
                botSendConsultationWelcomeMessage,
                botSendConsultationConfirmMessage
            );
            break;
        case "testimonial":
            botQueryListener.call(
                bot,
                "testimonial",
                chatID,
                botSendTestimonialWelcomeMessage,
                botSendTestimonialConfirmMessage
            );
            break;

        // FAQ
        case "paying":
            botRepeatStartMessage.call(bot, chatID);
            botSendPayingFAQ.call(bot, chatID);
            break;
        case "delivery":
            botRepeatStartMessage.call(bot, chatID);
            botSendDeliveryFAQ.call(bot, chatID);
            break;
        case "contacts":
            botRepeatStartMessage.call(bot, chatID);
            botSendContactsFAQ.call(bot, chatID);
            break;
        case "vehicleCustomization":
            botRepeatStartMessage.call(bot, chatID);
            botSendVehicleCustomizationFAQ.call(bot, chatID);
            break;
    }
});
