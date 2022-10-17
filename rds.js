const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
var mysql = require('mysql');
var http = require('http');

const task_metadata_endpoint = process.env.ECS_CONTAINER_METADATA_URI_V4;
console.log('Endpoint: ', task_metadata_endpoint);

http.get(task_metadata_endpoint, res => {
  let data = [];
  console.log('Status Code:', res.statusCode);

  res.on('data', chunk => {
    data.push(chunk);
  });

  res.on('end', () => {
    console.log('Response ended: ');
    const metadata = JSON.parse(Buffer.concat(data).toString());

    console.log(metadata)
  });
}).on('error', err => {
  console.log('Error: ', err.message);
});

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
        throw(err);
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

        rdsPool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
            if (error) throw error;
            console.log('The solution is: ', results[0].solution);
          });
    }
});

module.exports = function() { return [rdsPool, rdsUrl]; }