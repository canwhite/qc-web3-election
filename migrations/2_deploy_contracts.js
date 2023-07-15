var Election =  artifacts.require("./Election.sol")
//接收一个deployer，这里看着像是一个orm的过程
module.exports = function(deployer){
    deployer.deploy(Election)
}