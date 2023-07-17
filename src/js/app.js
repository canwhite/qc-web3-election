App = {
  //先初始化这几个值
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    //调用下边的initWeb3方法
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    //下一个函数拿到了合约信息
    return App.initContract();
  },

  //初始化智能合约信息
  initContract: function() {
    //通过RPC-JSON传递的是Election.json
    //然后回调里拿到的是election
    $.getJSON("Election.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      App.listenForEvents();
      // 拿到合约之后，调用下边的方法render
      return App.render();
    });
  },

  //调用合约中的投票方法
  castVote: function() {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function(instance) {
      return instance.vote(candidateId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  listenForEvents: function() {
    App.contracts.Election.deployed().then(function(instance) {
      //这里的watch类似subscribe
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    if (web3.currentProvider.enable) {
      //For metamask
      web3.currentProvider.enable().then(function(acc) {
        App.account = acc[0];
        $("#accountAddress").html("Your Account: " + App.account);
      });
    }

    // contracts里拿数据
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function(candidatesCount) {
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();


      //所以需要一个总数去循环
      for (var i = 1; i <= candidatesCount; i++) {
        //这算是如何遍历拿到value的方法吗，6啊，竟然用then
        electionInstance.candidates(i).then(function(candidate) {
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];

          // Render candidate Result
          var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
          candidatesResults.append(candidateTemplate);

          // Render candidate ballot option
          var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
          candidatesSelect.append(candidateOption);

        });
      }
      loader.hide();
      content.show();
      //返回是否已经投过票了
      return electionInstance.voters(App.account);


    }).then(function(hasVoted) {
      // Do not allow a user to vote
      if(hasVoted) {
        $('form').hide();
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});