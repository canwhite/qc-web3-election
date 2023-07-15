// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16 <0.9.0;  
contract Election {

    //Model a Candidate
    struct Candidate{
        uint id;
        string name;
        uint voteCount;
    }

    //定义一个mapping类型
    mapping(uint => Candidate) public candidates;

    //缓存状态，保留候选人个数
    uint public candidatesCount;

    //定义添加候选人的方法
    function addCandidate(string memory _name) private{
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount,_name,0);

    }
    // Constructor
    constructor() public {
        // candidate = "Candidate 1";
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }



}