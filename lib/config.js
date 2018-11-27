/*
* js4eos Powered by Eosfavor
* Jack Itleaks @2018
* itleaks@126.com
*/
const Request = require('./request')
var fs = require('fs');
var config = {}
defaultConfig = {
    networks:{
        mainnet: {
            chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
            httpEndpoint:'http://bp.cryptolions.io:8888',
            httpEndpoints:[
                'http://bp.cryptolions.io:8888',
                'https://mainnet.genereos.io',
                'https://mainnet.meet.one',
                'http://mainnet.eoscalgary.io',
            ],
            keyPrefix:'EOS',
        },
        localnet: {
            chainId:'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
            httpEndpoint:'http://127.0.0.1:8888',
            keyPrefix:'EOS',
        },
        eosforce: {
            chainId:'bd61ae3a031e8ef2f97ee3b0e62776d6d30d4833c8f7c1645c657b149151004b',
            httpEndpoint:'http://47.97.115.84:8888',
            keyPrefix:'EOS',
        },
        jungle: {
            chainId:'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473',
            httpEndpoint:'http://jungle2.cryptolions.io:8888',
            httpEndpoints:[
                'https://jungle2.cryptolions.io:443',
                'http://jungle.eosgen.io:80',
                'https://api.jungle.alohaeos.com:443',
                'http://145.239.133.201:8888',
            ],
            keyPrefix:'EOS',
            faucet: {
                type:"api",
                url:"http://api.eosfavor.com/faucetaccount",
            }
        },
        kylin: {
            chainId:'5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
            httpEndpoint:'http://api.kylin.eosbeijing.one:8880',
            httpEndpoints: [
                'http://api.kylin.eosbeijing.one:8880',
                'http://api-kylin.starteos.io',
                'http://39.108.231.157:30065',
                'http://api.kylin.eoseco.com',
                'https://api-kylin.eoslaomao.com',
            ],
            keyPrefix:'EOS',
        },
        enu: {
            chainId:'5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
            httpEndpoint:'http://enu.mytokenpocket.vip',
            keyPrefix:'ENU',
        },
        fibos: {
            chainId:'6aa7bd33b6b45192465afa3553dedb531acaaff8928cf64b70bd4c5e49b7ec6a',
            httpEndpoint:'http://se-rpc.fibos.io:8870',
            keyPrefix:'FO',
        },
    },
    faucet:{
        type:'web',
        url:'https://github.com/itleaks/js4eos/blob/master/docs/faucet.md'
    },
    currentNetwork:'mainnet',
    serviceUrl:'http://api.eosfavor.com',
    syncUrl:'https://raw.githubusercontent.com/itleaks/js4eos/master/files/config.json',
    dataDir:require('path').join(require('os').homedir(), ".js4eos"),
    keosd_provide_timeout:30*60*1000, //30min
    disable_keosd:false,
}

if (process.env.JS4EOS_DATADIR) {
    defaultConfig.dataDir = require('path').join(process.env.JS4EOS_DATADIR, ".js4eos")
}
if (!fs.existsSync(defaultConfig.dataDir)) {
    try {
        fs.mkdirSync(defaultConfig.dataDir,'0777', true)
    } catch(e) {
        console.log(e)
    }
}

var configFile = require('path').join(defaultConfig.dataDir, "config.json");

function loadConfig() {
    let config = {}
    if (!fs.existsSync(configFile)) {
        return config
    }
    try {
        let data = fs.readFileSync(configFile);
        config = JSON.parse(data);
    } catch(e) {
        console.log(e)
    }
    return config;
}

function disableKeosd(value, persist) {
    config.disable_keosd = value;
    if (persist) {
        this.saveConfig(config)
    }
}

exports.resetConfig = async function() {
    if (!fs.existsSync(configFile)) {
        return config
    }
    try {
        fs.unlinkSync(configFile);
    } catch(e) {
        console.log("reset fail")
    }
    config = defaultConfig
    return config
}

exports.saveConfig = function(config) {
    if (config['dataDir'] != undefined) {
        delete config['dataDir']
    }
    let data = JSON.stringify(config);
    try {
        fs.writeFileSync(configFile, data);
    } catch(e) {
        console.log(e)
    }
}

exports.getConfig = function() {
    return config;
}

exports.getNetwork = function() {
    return config.networks[config.currentNetwork];
}

exports.syncConfig = async function() {
    try {
        let res = await Request.get(config.syncUrl);
        config = JSON.parse(res)
        return config;
    } catch(e) {
        return null;
    }
}

var userConfig = loadConfig();
if (userConfig['dataDir'] != undefined) {
    delete userConfig['dataDir']
}
config = {...defaultConfig, ...userConfig}