const fs = require("fs");

const baseUrl = __dirname + "/";
// const baseUrl = "/tmp/" ;

const fileName = baseUrl + "users.json";
const contactFileName = baseUrl + "contacts.json";
const fetch = require("node-fetch");
const AWS = require("aws-sdk");

const config = {
    endpoint: process.env.LIARA_ENDPOINT,
    accessKeyId: process.env.LIARA_ACCESS_KEY,
    secretAccessKey: process.env.LIARA_SECRET_KEY,
    region: "default",
};

const client  = new AWS.S3(config);

//token
//eyJ1c2VybmFtZSI6IjA5MDAwMDAwMDAwIiwicGFzc3dvcmQiOiJ4eHh4eHh4eCIsIm5hbWUiOiJ4eHgiLCJkYXRlIjoiMjAyMy0wNi0wOVQxNDoyOTozOC4zMDlaIn0=

const getContact = (username, contactUsername) => {
    try {
        const data = fs.readFileSync(contactFileName, { encoding: 'utf8', flag: 'r' });
        const contactList = JSON.parse('[' + (data?.slice(0, -1) || '') + ']');
        return contactList.find(u => u.username == contactUsername && u.ref == username)
    } catch { }

    return null;
}

const getUser = (username) => {

    try {
        const data = fs.readFileSync(fileName, { encoding: 'utf8', flag: 'r' });
        const userList = JSON.parse('[' + (data?.slice(0, -1) || '') + ']');
        return userList.find(u => u.username == username)
    } catch (e) {
    }

    return null;
}

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1] || authHeader;

        try {
            const userToken = JSON.parse(atob(token))
            const user = getUser(userToken?.username)
            if (!user) {
                return res.status(403).json({
                    code: "403",
                    message: 'کاربر یافت نشد!',
                })
            }

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

const sendToEita = (title, text) => {
    try {
        fetch("https://eitaayar.ir/api/bot28628:d0645003-3706-4772-84a4-4e3a9ec02311/sendMessage", {
            "headers": {
                "content-type": "application/json",
            },
            "body": JSON.stringify({
                chat_id: "9250300",
                text: text.replace('{\n', '').replace('\n}', ''),
                title: title || 'api',
                parse_mode: "html"
            }),
            "method": "POST",
        }).then(res => {
            console.log('send')
        });
    } catch (e) {
        console.log(e)
    }

}


module.exports = { sendToEita, authenticate, getUser, baseUrl, getContact }