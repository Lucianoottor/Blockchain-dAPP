// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Election {
  string public candidateName;
  constructor() {
    candidateName = "Candidate 1";
  }
  function setCandidate(string memory name) public {
    candidateName = name;
  }
}
