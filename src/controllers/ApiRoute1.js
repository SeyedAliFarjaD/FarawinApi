const express = require('express')

const router = express.Router()
const fs = require("fs");
const fetch = require("node-fetch");

const { authenticate, getContact, sendToEita, baseUrl } = require("../middlewares/auth");

const fileName = baseUrl + "contacts.json";


router.route('/contact/json').get((req, res, next) => {
    // #swagger.ignore = true
    fs.readFile(fileName, 'utf8', function (err, data) {
        return res.appendHeader('Cache-Control', 'no-cache').send(data)
    });

});

router.route('/contact/jsonDelete').get((req, res, next) => {
    // #swagger.ignore = true
    fs.unlinkSync(fileName);
    return res.status(200).json({
        code: "200",
        message: 'DELETED!',
    })

});

router.route('/contact').post(authenticate, (req, res, next) => {
    /* 
    #swagger.tags = ['Contact']
    #swagger.summary = 'افزودن مخاطب'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'نام کاربری که باید شماره موبایل باشد و نام و نام‌خانوداگی باید بیش از ۳ کرکتر باشد. ',
        required: true,
        type: 'json',
        schema: {
                    username: '09000000000',
                    name: 'xxx',
                }
} */

    const { username, name } = req.body;
    const user = req.user;

    fs.readFile(fileName, 'utf8', function (err, data) {

        const contactList = JSON.parse('[' + (data?.slice(0, -1) || '') + ']');


        //TODO REGEX DIGIT
        if (!username.startsWith('09') || username.length != 11)
            return res.status(400).json({
                code: "400",
                message: 'نام کاربری که باید شماره موبایلی 11 رقمی بوده و با 09 آغاز شود! ',
            })


        if (name.length < 3)
            return res.status(400).json({
                code: "400",
                message: ' نام و نام‌خانوداگی باید حداقل 3 کرکتر باشد!',
            })

        const findContact = contactList.find(c => c.username == username && c.ref == user.username)

        if (findContact)
            return res.status(409).json({
                code: '409',
                message: 'موبایل تکراری است!',
                contact: findContact
            })

        const contact = { username, name, date: new Date(), ref: user.username };

        fs.appendFile(fileName, JSON.stringify(contact) + ',', function (err) {
            if (err) return res.status(500).json({
                code: "500",
                message: 'خطایی در ذخیره سازی اطلاعات روی داد!',
                error: err
            })

            // sendToEita("Register", "#Register" + "\n" + JSON.stringify({ username, name }, null, "\t"));
            sendToEita("Add_Contact", "#Add_Contact" + "\n" + `username: ${user.username}\nname: ${user.name}`);

            return res.status(200).json({
                code: '200',
                message: 'با موفقیت افزوده شد.',
                contact
            })

        });

    });


    // res.status(200).json({
    //     data: [],
    //     message: 'Successfully found',
    // })
})


router.route('/contact').get(authenticate, (req, res, next) => {
    /*  
    #swagger.tags = ['Contact']
    #swagger.summary = 'گرفتن تمام مخاطبین' */


    fs.readFile(fileName, 'utf8', function (err, data) {
        return res.status(200).json({
            code: '200',
            message: 'با موفقیت دریافت شد.',
            contactList: JSON.parse('[' + (data?.slice(0, -1) || '') + ']')
        })
    });


})


module.exports = router