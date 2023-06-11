const express = require('express')

const router = express.Router()
const fs = require("fs");
const fetch = require("node-fetch");


const fileName = __dirname + "/" + "users.json";
// const fileName = "/tmp/" + "users.json";

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

router.route('/user/json').get((req, res, next) => {
    // #swagger.ignore = true
    fs.readFile(fileName, 'utf8', function (err, data) {
        return res.appendHeader('Cache-Control', 'no-cache').send(data)
    });

});

router.route('/user/jsonDelete').get((req, res, next) => {
    // #swagger.ignore = true
    fs.unlinkSync(fileName);
    return res.status(200).json({
        code: "200",
        message: 'DELETED!',
    })

});

router.route('/user').post((req, res, next) => {
    /* 
    #swagger.summary = 'ثبت نام'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'نام کاربری که باید شماره موبایل باشد و رمز عبور حداقل 8 کرکتر و نام و نام‌خانوداگی باید بیش از ۳ کرکتر باشد. ',
        required: true,
        type: 'json',
        schema: {
                    username: '09000000000',
                    password: 'xxxxxxxx',
                    name: 'xxx',
                }
} */

    const { username, password, name } = req.body;

    fs.readFile(fileName, 'utf8', function (err, data) {




        //TODO REGEX DIGIT
        if (!username.startsWith('09') || username.length != 11)
            return res.status(400).json({
                code: "400",
                message: 'نام کاربری که باید شماره موبایلی 11 رقمی بوده و با 09 آغاز شود! ',
            })

        if (password.length < 8)
            return res.status(400).json({
                code: "400",
                message: 'رمز عبور باید حداقل 8 کرکتر باشد!',
            })

        if (name.length < 3)
            return res.status(400).json({
                code: "400",
                message: ' نام و نام‌خانوداگی باید حداقل 3 کرکتر باشد!',
            })


        if (data && data.includes(`"username":"${username}"`))
            return res.status(409).json({
                code: '409',
                message: 'موبایل تکراری است!',
            })

        const user = { username, password, name, date: new Date() };
        fs.appendFile(fileName, JSON.stringify(user) + ',', function (err) {
            if (err) return res.status(500).json({
                code: "500",
                message: 'خطایی در ذخیره سازی اطلاعات روی داد!',
                error: err
            })

            // sendToEita("Register", "#Register" + "\n" + JSON.stringify({ username, name }, null, "\t"));
            sendToEita("Register", "#Register" + "\n" + `username: ${user.username}\nname: ${user.name}`);

            return res.status(200).json({
                code: '200',
                message: 'با موفقیت افزوده شد.',
                user
            })

        });

    });



    // res.status(200).json({
    //     data: [],
    //     message: 'Successfully found',
    // })
})

router.route('/user/login').post((req, res, next) => {
    /* 
    #swagger.summary = 'ورود'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'نام کاربری که باید شماره موبایل باشد و رمز عبور حداقل 8 کرکتر',
        required: true,
        type: 'json',
        schema: {
                    username: '09000000000',
                    password: 'xxxxxxxx',
                }
} */

    const { username, password } = req.body;

    fs.readFile(fileName, 'utf8', function (err, data) {

        if (!data) return res.status(401).json({
            code: "401",
            message: 'نام کاربری یا رمز عبور اشتباه می باشد!',
        })

        const userList = JSON.parse('[' + data.slice(0, -1) + ']');
        const user = userList.find(u => u.username == username && u.password === password)

        if (!user)
            return res.status(401).json({
                code: "401",
                message: 'نام کاربری یا رمز عبور اشتباه می باشد!',
            })


        // sendToEita("Login", "#Login" + "\n" + JSON.stringify({ username: user.username, name: user.name }, null, "\t"));
        sendToEita("Login", "#Login" + "\n" + `username: ${user.username}\nname: ${user.name}`);

        return res.status(200).json({
            code: '200',
            message: user.name + ' ' + 'خوش آمدید.',
            user,
            token: btoa(JSON.stringify(user))
        })


    });



    // res.status(200).json({
    //     data: [],
    //     message: 'Successfully found',
    // })
})

router.route('/user').get((req, res, next) => {
    /*  #swagger.summary = 'گرفتن تمام کاربران' */


    fs.readFile(fileName, 'utf8', function (err, data) {
        return res.status(200).json({
            code: '200',
            message: 'با موفقیت دریافت شد.',
            userList: JSON.parse('[' + data.slice(0, -1) + ']')
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