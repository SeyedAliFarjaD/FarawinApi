const express = require('express')

const router = express.Router()
const fs = require("fs");
const fetch = require("node-fetch");


const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1] || authHeader;

        try {
            const user = JSON.parse(atob(token))
            req.user = user;
            return next();
        } catch { }

        return res.status(403).json({
            code: "403",
            message: 'توکن صحیح نمی باشد!',
        })

    }

    return res.status(401).json({
        code: "401",
        message: 'زرنگی توکن نفرستادی!',
    })
};

const fileName = __dirname + "/" + "contacts.json";
// const fileName = "/tmp/" + "contacts.json";

const sendToEita = (title, text) => {
    try {
        fetch("https://eitaayar.ir/api/bot28628:d0645003-3706-4772-84a4-4e3a9ec02311/sendMessage", {
            "headers": {
                "content-type": "application/json",
            },
            "body": JSON.stringify({
                chat_id: "9250300",
                text: text.replace('{\n', '').replace('\n}', ''),
                title: title || 'api'
            }),
            "method": "POST",
        }).then(res => {
            console.log('send')
        });
    } catch (e) {
        console.log(e)
    }

}

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
    /*  #swagger.summary = 'گرفتن تمام مخاطبین' */


    fs.readFile(fileName, 'utf8', function (err, data) {
        return res.status(200).json({
            code: '200',
            message: 'با موفقیت دریافت شد.',
            contactList: JSON.parse('[' + data.slice(0, -1) + ']')
        })
    });


})



// router.route('/test-get').get(authorize, (req, res, next) => {
//     // #swagger.description = "Description here..."
//     res.status(200).json({
//         data: [],
//         message: 'Successfully found'
//     })
// })

// router.route('/test-delete/:id').delete(authorize, async (req, res, next) => {
//     res.status(200).json({
//         msg: [],
//         message: 'Delete!'
//     })
// })

module.exports = router