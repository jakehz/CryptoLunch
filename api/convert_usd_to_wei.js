function convert_usd_to_wei(usd_amount) {

    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    let url = "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&api_key={16e69d33d794482d6e94f576e338d313d924368aa4633637e2ce899af075bc02}";
    let eth_to_wei = 1000000000000000000;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false); // false for synchronous request
    xmlHttp.send( null );
    response_num = JSON.parse(xmlHttp.responseText).USD
    let usd_to_eth = usd_amount / response_num
    console.log("ETH: " + usd_to_eth)
    console.log("Wei: " +usd_to_eth * eth_to_wei);
    return usd_to_eth * eth_to_wei;

}

module.exports = convert_usd_to_wei;