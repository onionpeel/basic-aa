```
git clone https://github.com/matter-labs/local-setup.git
cd local-setup
./start.sh
```

Create .env file and add the line `NODE_ENV="test"`.

```
yarn hardhat compile
yarn hardhat test
```

The issue is that variables on the AA account are not being read.  For example, the following throws an error:
`const storedValue = await account.storedValue();`

This is not a problem when reading variables from contracts that were deployed directly to zkSync.  Ex, `aaBytecodeHash` can be read from AAFactory.sol.  