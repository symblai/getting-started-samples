const request = require('request');

module.exports = ({appId, appSecret}) => {

    const authOptions = {
        method: 'post',
        url: "https://api.symbl.ai/oauth2/token:generate",
        body: {
            type: "application",
            appId,
            appSecret
        },
        json: true
    };

    return new Promise((resolve, reject) => {
        request(authOptions, (err, res, body) => {
            if (err) {
                console.error('error posting json: ', err);
                reject(err);
            }
            console.log(body)
            resolve(body);
        });
    });

}