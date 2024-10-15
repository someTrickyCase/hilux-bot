require("dotenv").config();

const BITRIX_KEY = process.env.BITRIX_KEY;

async function getBitrixLeadStatus(id) {
    console.log("getBitrixLeadStatus");
    try {
        const res = await fetch(
            `https://troffi.bitrix24.ru/rest/253/${BITRIX_KEY}/crm.lead.get/?id=${id}`
        );
        const resJSON = await res.json();
        const statusDescription = resJSON?.result?.UF_CRM_1728573871;
        return statusDescription
            ? `Статус вашего заказа: ${statusDescription}`
            : "Мы не нашли заказа с таким номером 😥";
    } catch (error) {
        console.error(error);
    }
}

async function getBitrixLeadComment(id) {
    console.log("getBitrixLeadComment");
    try {
        const res = await fetch(
            `https://troffi.bitrix24.ru/rest/253/${BITRIX_KEY}/crm.lead.get/?id=${id}`
        );
        const resJSON = await res.json();
        console.log(resJSON, "RES COMMENT");
        const comments = resJSON?.result?.COMMENTS;
        console.log("OLD COMMENT", comments);
        return comments;
    } catch (error) {
        console.error(error);
    }
}

async function postNewBitrixLead(data) {
    console.log("postNewBitrixLead");
    try {
        const res = await fetch(
            `https://troffi.bitrix24.ru/rest/253/${BITRIX_KEY}/crm.lead.add.json/`,
            {
                method: "post",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );
        return await res.json();
    } catch (error) {
        console.error(error);
    }
}

async function updateBitrixLeadComment(id, newComment) {
    console.log("Update Bitrix Lead");
    try {
        const oldComment = await getBitrixLeadComment(id);
        newString = `${oldComment}\n${newComment}`;
        const res = await fetch(
            `https://troffi.bitrix24.ru/rest/253/${BITRIX_KEY}/crm.lead.update.json/?id=${id}`,
            {
                method: "post",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    fields: {
                        COMMENTS: newString,
                    },
                }),
            }
        );
        return res;
    } catch (error) {
        console.error(error);
    }
}

module.exports = { getBitrixLeadStatus, postNewBitrixLead, updateBitrixLeadComment };
