// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SQLQueryContract {
    struct Query {
        string userId;
        string sqlQuery;
    }

    mapping(uint256 => Query) public queries;
    uint256 public queryCount;

    event QuerySubmitted(
        uint256 indexed queryId,
        string userId,
        string sqlQuery
    );

    function submitQuery(
        string memory _userId,
        string memory _sqlQuery
    ) external {
        queryCount++;
        queries[queryCount] = Query(_userId, _sqlQuery);
        emit QuerySubmitted(queryCount, _userId, _sqlQuery);
    }
}
