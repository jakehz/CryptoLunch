pragma solidity ^0.8.0;

// note: due to restrictions in solidity all transactions must 
// be considered in wei. This may cause difficulty in the front end. 
contract Pool {
    int256 due;
    // "payable" because we need to pay out to the contract when the 
    address payable payout;
    constructor (int256 _due, address payable _payout) public {
        due = _due;
        payout = _payout;
    }
    function deposit(uint256 amount) payable public {
        // checks that the amount deposited is the amount entered in the message
        require(msg.value == amount);
        int256  signedAmount = int256(msg.value);
        due = due - signedAmount;
        if (due <= 0){
            uint256 leftOver = uint256(-1*due);
            // transfer the amount leftover
            if (address(this).balance > leftOver && leftOver != 0) {
                payable(msg.sender).transfer(uint256(leftOver));
            }
            due = 0;
            if (address(this).balance > 0){
                payout.transfer(address(this).balance);
            }
        }
    }
    function getDue() public view returns (int256){
        return due;
    }
    function getBalance() public view returns (uint256){
        // access this smart contract's address
        return address(this).balance;
    }
}