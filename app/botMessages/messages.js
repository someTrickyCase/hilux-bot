const { startKeyboard, startInlineKeyboard } = require("./keyboards.js");
const { DICTIONARY } = require("../config/dictionary.js");

async function botSendStartMessages(chatID) {
    try {
        await this.sendMessage(chatID, DICTIONARY.onStartMessage, startKeyboard);
        await this.sendMessage(chatID, DICTIONARY.ctaMessage, startInlineKeyboard);
    } catch (error) {
        console.error(error);
    }
}

async function botSendOrderConfirmMessages(chatID, bitrixID) {
    try {
        await this.sendMessage(chatID, `${DICTIONARY.orderConfirmMessage} ${bitrixID}`);
    } catch (error) {
        console.error(error);
    }
}

async function botRepeatStartMessage(chatID) {
    try {
        await this.sendMessage(chatID, DICTIONARY.repeatableStartMessage, startKeyboard);
    } catch (error) {
        console.error(error);
    }
}

async function botSendTestimonialConfirmMessage(chatID) {
    try {
        await this.sendMessage(chatID, DICTIONARY.testimonialConfirmMessage);
    } catch (error) {
        console.error(error);
    }
}

async function botSendTestimonialWelcomeMessage(chatID) {
    try {
        await this.sendMessage(chatID, DICTIONARY.testimonialWelcomeMessage);
    } catch (error) {
        console.error(error);
    }
}

async function botSendConsultationWelcomeMessage(chatID) {
    try {
        await this.sendMessage(chatID, DICTIONARY.consultationWelcomeMessage);
    } catch (error) {
        console.error(error);
    }
}

async function botSendConsultationConfirmMessage(chatID) {
    try {
        await this.sendMessage(chatID, DICTIONARY.consultationConfirmMessage);
    } catch (error) {
        console.error(error);
    }
}

async function botSendProductWelcomeMessage(chatID) {
    try {
        await this.sendMessage(chatID, DICTIONARY.productWelcomeMessage);
    } catch (error) {
        console.error(error);
    }
}

async function botSendProductConfirmMessage(chatID) {
    try {
        await this.sendMessage(chatID, DICTIONARY.productConfirmMessage);
    } catch (error) {
        console.error(error);
    }
}

async function botSendOrderWelcomeMessage(chatID) {
    try {
        await this.sendMessage(chatID, DICTIONARY.orderWelcomeMessage);
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    botSendStartMessages,
    botSendOrderConfirmMessages,
    botRepeatStartMessage,
    botSendTestimonialConfirmMessage,
    botSendTestimonialWelcomeMessage,
    botSendConsultationWelcomeMessage,
    botSendConsultationConfirmMessage,
    botSendProductWelcomeMessage,
    botSendProductConfirmMessage,
    botSendOrderWelcomeMessage,
};
