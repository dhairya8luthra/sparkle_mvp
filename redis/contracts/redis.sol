// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RedisContract {
    struct RedisData {
        string key;
        string value;
    }

    mapping(uint256 => RedisData) public redisData;
    uint256 public dataCount;

    event DataAdded(uint256 indexed id, string key, string value);
    event DataUpdated(uint256 indexed id, string key, string value);

    function addData(string memory _key, string memory _value) public {
        dataCount++;
        redisData[dataCount] = RedisData(_key, _value);
        emit DataAdded(dataCount, _key, _value);
    }

    function updateData(uint256 _id, string memory _key, string memory _value) public {
        require(_id <= dataCount, "Invalid ID");
        redisData[_id] = RedisData(_key, _value);
        emit DataUpdated(_id, _key, _value);
    }

    function getData(uint256 _id) public view returns (string memory, string memory) {
        require(_id <= dataCount, "Invalid ID");
        RedisData memory data = redisData[_id];
        return (data.key, data.value);
    }
}