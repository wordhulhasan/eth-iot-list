// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract IotList {
    uint public transactionCount = 0;

    struct Transaction{
        uint id;
        string content;
        string value;
    }

    mapping (uint => Transaction ) public transactions;

    event TransactionCreated(
        uint id,
        string content,
        string value
    );

    constructor() public{
        createTransaction("Blood Pressure", "Low");
    }

    function createTransaction(string memory _content, string memory _value) public {
        transactionCount++;
        transactions[transactionCount] = Transaction(transactionCount,_content,_value);
    }
}