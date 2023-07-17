// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16 <0.9.0;  
contract Election {

    //Model a Candidate
    struct Candidate{
        uint id;
        string name;
        uint voteCount;
    }


    //写个用于监听的event
    event votedEvent (
        //indexed 事件参数关键词, 可以过滤日志查找关键词数据, 而不是获取所有日志
        uint indexed _candidateId
    );

    //定义一个mapping类型
    mapping(uint => Candidate) public candidates;

    //缓存状态，保留候选人个数
    uint public candidatesCount;

    //定义添加候选人的方法
    //这里要家memory，但是下边不用加，是因为字符串在这里被认为是动态数组
    function addCandidate(string memory _name) private{
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount,_name,0);
    }

    //Store accounts that have voted
    //括号中主要是key和value的映射
    mapping(address => bool) public voters;

    //function vote
    function vote (uint _candidateId) public {

        //先进行一些错误判断，可以理解为自带false阻断的if
        //如果这个人没有投过票才能往下
        require(!voters[msg.sender]);

        //require a valid candidate
        require(_candidateId >0 && _candidateId <= candidatesCount);

        // record that voter has voted
        voters[msg.sender] = true;

        //update candidate vote count
        candidates[_candidateId].voteCount ++;

        // trigger voted event 
        emit votedEvent(_candidateId);


    }





    // Constructor
    constructor() public {
        // candidate = "Candidate 1";
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }



}