// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;
contract Election {
    
    //read/write candidate，可见性修饰符在后边
    string public candidate;

    // Constructor
    constructor() {
        candidate = "Candidate 1";
    }



}