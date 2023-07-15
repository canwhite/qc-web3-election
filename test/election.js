//主要目的可能在减少花费
var Election = artifacts.require("./Election.sol");

//This callback function provides an "accounts" variable that represents all the accounts on our blockchain, provided by Ganache.
contract("Election", function(accounts) {
  var electionInstance;

  //it开始，回调中assert，但是先拿到instance，然后往下传递
  it("initializes with two candidates", function() {
    //最后返回
    return Election.deployed().then(function(instance) {
      return instance.candidatesCount();
    }).then(function(count) {
      assert.equal(count, 2);
    });
  });

  it("it initializes the candidates with the correct values", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.candidates(1);
    }).then(function(candidate) {
      //测试单个candidate的各个属性
      assert.equal(candidate[0], 1, "contains the correct id");
      assert.equal(candidate[1], "Candidate 1", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      //返回下一个candidate接着往下进行
      return electionInstance.candidates(2);
    }).then(function(candidate) {
      assert.equal(candidate[0], 2, "contains the correct id");
      assert.equal(candidate[1], "Candidate 2", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
    });
  });
});