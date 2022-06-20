const express = require('express')
const app = express()
const port = 9000;
const Hawk = require('hawk');
const {json} = require('body-parser');
const asyncHandler = require('express-async-handler');

const credentialsFunc = (id) => {
    if (id === 'someid') {
        return {
            key: 'werxhqb98rpaxn39848xrunpaw3489ruxnpa98w4rxn',
            algorithm: 'sha256',
            user: 'Steve'
        };
    }
};

app.use(json({
    verify(req, res, buf) {
        // a trick to save message body
        req.rawBody = buf;
    }
}));
app.post('/', asyncHandler(async (req, res) => {
    let status = 200;
    let payload = '';
    try {
        const {credentials, artifacts} = await Hawk.server.authenticate(req, credentialsFunc, {payload: req.rawBody});
        payload = `Hello ${credentials.user} ${artifacts.ext}`;
    } catch (error) {
        console.error(error);
        payload = 'Shoosh!';
        status = 401;
    }
    res.status(status).json({payload});
}));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
