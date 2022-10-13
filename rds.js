const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
var mysql = require('mysql');

const secretsManagerClient = new SecretsManagerClient({
  region: 'us-east-1'
});
  
const params = {
  SecretId: process.env.secret
}

let rdsPool = null;
let rdsUrl = null;

secretsManagerClient.send(new GetSecretValueCommand(params), async (err, data) => {
    if (err) {
        reject(err);
    }
    else {
        const secret = await JSON.parse(data.SecretString);
        rdsUrl = secret.host;
        rdsPool = mysql.createPool({
            connectionLimit : 12,
            host: secret.host,
            password: secret.password,
            user: secret.username
        });
        rdsPool.on('error', err=> {
            console.error('Unexpected error on idle client', err);
            process.exit(-1);
        }); 
    }
});

module.exports = function() { return [rdsPool, rdsUrl]; }