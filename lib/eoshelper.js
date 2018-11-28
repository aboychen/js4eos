/*
* js4eos Powered by Eosfavor
* Jack Itleaks @2018
* itleaks@126.com
*/

var Network = require('./config').getNetwork();
var Config = require('./config').getConfig();
var Eosjs = require('./eosjs').eosjs;

var Wallet = require('./wallet');
var keyProvider;
if (Config.inLibMode) {
    keyProvider = Config.keyProvider
} else {
    keyProvider = () => Wallet.getPrivateKeys();
}
// Private key or keys (array) provided statically or by way of a function.
// For multiple keys, the get_required_keys API is used (more on that below).
eos = Eosjs({
    httpEndpoint:Network.httpEndpoint,
    chainId:Network.chainId,
    keyProvider:keyProvider,
    expireInSeconds: 60,
    broadcast: true,
    verbose: false,
    sign: true
})

exports.EOS = eos