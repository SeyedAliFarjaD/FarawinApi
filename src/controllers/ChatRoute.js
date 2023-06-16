const express = require('express')

const router = express.Router()
const fs = require("fs");

const { authenticate, getContact, sendToEita, baseUrl } = require("../middlewares/auth");

const fileName = baseUrl + "chats.json";

router.route('/chat/json').get((req, res, next) => {
    // #swagger.ignore = true
    fs.readFile(fileName, 'utf8', function (err, data) {
        return res.appendHeader('Cache-Control', 'no-cache').send(data)
    });

});

router.route('/chat/jsonDelete').get((req, res, next) => {
    // #swagger.ignore = true
    fs.unlinkSync(fileName);
    return res.status(200).json({
        code: "200",
        message: 'DELETED!',
    })

});

router.route('/chat').post(authenticate, async (req, res, next) => {
    /* 
    #swagger.tags = ['Chat']
    #swagger.summary = 'افزودن پیام'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'نام کاربری که باید شماره موبایل مخاطب باشد و پیام ارسالی که فرمت متن یا اچ تی ام ال. ',
        required: true,
        type: 'json',
        schema: {
                    contactUsername: '09000000000', 
                    textHtml: '',
                }
} */

    const { contactUsername, textHtml } = req.body;
    const user = req.user;
    const username = contactUsername;
    //TODO REGEX DIGIT
    if (!username.startsWith('09') || username.length != 11 || !username.match(/^09([0-9]{9})/))
        return res.status(400).json({
            code: "400",
            message: 'نام کاربری که باید شماره موبایلی 11 رقمی بوده و با 09 آغاز شود! ',
            errorField: 'contactUsername'
        })


    if (textHtml.length < 3)
        return res.status(400).json({
            code: "400",
            message: 'پیامی ارسال نشده است!',
            errorField: 'textHtml'
        })

    const contact = getContact(user.username, contactUsername);
    if (!contact) return res.status(404).json({
        code: "404",
        message: 'مخاطب یافت نشد!',
        errorField: 'contactUsername'
    })

    const chat = { receiver: username, text: textHtml, date: new Date(), sender: user.username };

    fs.appendFile(fileName, JSON.stringify(chat) + ',', function (err) {
        if (err) return res.status(500).json({
            code: "500",
            message: 'خطایی در ذخیره سازی اطلاعات روی داد!',
            error: err
        })

        sendToEita("Chat", "#Chat" + "\n" + `from: ${user.username}\nto: ${username}\ntext: ${textHtml}`);

        return res.status(200).json({
            code: '200',
            message: 'با موفقیت افزوده شد.',
            chat
        })

    });

})


router.route('/chat').get(authenticate, (req, res, next) => {
    /*  
    #swagger.tags = ['Chat']
    #swagger.summary = 'گرفتن تمام چت‌ها' */

    fs.readFile(fileName, 'utf8', function (err, data) {
        return res.status(200).json({
            code: '200',
            message: 'با موفقیت دریافت شد.',
            contactList: JSON.parse('[' + (data?.slice(0, -1) || '') + ']')
        })
    });


})

module.exports = router