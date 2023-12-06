// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

contract CampaignFactory {
	address[] private deployedCampaigns;

	function createCampaign(uint minimum) public {
		address newCampaign = address(new Campaign(minimum, msg.sender));
		deployedCampaigns.push(newCampaign);
	}

	function getDeployedCampaigns() public view returns (address[] memory) {
		return deployedCampaigns;
	}
}

contract Campaign {
	address public manager;
	uint256 public minimumContribution;
	mapping(address => bool) public approvers;
	uint public approversCount;
	Request[] public requests;

	modifier restricted() {
		require(msg.sender == manager);
		_;
	}

	constructor(uint256 minimum, address _creator) {
		manager = _creator;
		minimumContribution = minimum;
	}

	function contribute() public payable {
		require(msg.value >= minimumContribution);

		approvers[msg.sender] = true;
		approversCount++;
	}

	function createRequest(
		string calldata description,
		uint256 value,
		address recipient
	) public restricted {
		Request storage newRequest = requests.push();
		newRequest.description = description;
		newRequest.value = value;
		newRequest.recipient = recipient;
		newRequest.complete = false;
		newRequest.approvalsCount = 0;
	}

	function approveRequest(uint256 index) public {
		Request storage request = requests[index];

		require(approvers[msg.sender]);
		require(!request.votes[msg.sender]);

		request.approvalsCount++;
		request.votes[msg.sender] = true;
	}

	function finalizeRequest(uint index) public restricted {
		Request storage request = requests[index];

		require(!request.complete);
		require(request.approvalsCount > (approversCount / 2));
		require(address(this).balance >= request.value);

		payable(request.recipient).transfer(request.value);
		request.complete = true;
	}

	function getSummary()
		public
		view
		returns (uint, uint, uint, uint, address)
	{
		return (
			minimumContribution,
			address(this).balance,
			requests.length,
			approversCount,
			manager
		);
	}

	function getRequestsCount() public view returns (uint) {
		return requests.length;
	}
}

struct Request {
	string description;
	uint256 value;
	address recipient;
	bool complete;
	mapping(address => bool) votes;
	uint256 approvalsCount;
}
