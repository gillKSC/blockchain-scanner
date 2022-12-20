DROP TABLE IF EXISTS Block_parent;
DROP TABLE IF EXISTS Transaction_parties;
DROP TABLE IF EXISTS Transaction;
DROP TABLE IF EXISTS Block;
DROP TABLE IF EXISTS Wallet;

CREATE TABLE Wallet (
  balance FLOAT NOT NULL,
  address VARCHAR(42) NOT NULL,
  PRIMARY KEY (address)
);

CREATE TABLE Block (
  blockID INT NOT NULL,
  timeStamp INT NOT NULL,
  blockReward FLOAT NOT NULL,
  minerAddress VARCHAR(42) NOT NULL,
  PRIMARY KEY (blockID),
  FOREIGN KEY (minerAddress) REFERENCES Wallet(address)
);

CREATE TABLE Transaction (
  transactionHash VARCHAR(66) NOT NULL,
  value FLOAT NOT NULL,
  transactionFee FLOAT NOT NULL,
  status VARCHAR(15) NOT NULL,
  gasUsed FLOAT NOT NULL,
  blockID INT NOT NULL,
  PRIMARY KEY (transactionHash),
  FOREIGN KEY (blockID) REFERENCES Block(blockID)
);

CREATE TABLE Transaction_parties (
  fromAddress VARCHAR(42) NOT NULL,
  toAddress VARCHAR(42) NOT NULL,
  transactionHash VARCHAR(66) NOT NULL,
  FOREIGN KEY (transactionHash) REFERENCES Transaction(transactionHash),
  FOREIGN KEY (fromAddress) REFERENCES Wallet(address),
  FOREIGN KEY (toAddress) REFERENCES Wallet(address)
);

CREATE TABLE Block_parent (
  childBlock INT NOT NULL,
  parentBlock INT NOT NULL,
  FOREIGN KEY (childBlock) REFERENCES Block(blockID),
  FOREIGN KEY (parentBlock) REFERENCES Block(blockID)
);