import { expect } from 'chai';
import { Wallet, Contract, Provider, utils } from 'zksync-web3';
import * as hre from 'hardhat';
import * as ethers from 'ethers';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';

const RICH_WALLET_PK =
  '0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110';

describe('Deployment', () => {
    let provider: Provider;
    let wallet: Wallet;
    let deployer: Deployer;
    let factory: Contract;
    let account: Contract;


    it('Creates AA account', async () => {
        provider = Provider.getDefaultProvider();
        wallet = new Wallet(RICH_WALLET_PK, provider);
        deployer = new Deployer(hre, wallet);


        const factoryArtifact = await deployer.loadArtifact('AAFactory');
        const accountArtifact = await deployer.loadArtifact('DefaultAccount');
        const bytecodeHash = utils.hashBytecode((await factoryArtifact).bytecode);
        factory = await deployer.deploy(factoryArtifact, [bytecodeHash], undefined, [accountArtifact.bytecode]);

        const salt = ethers.constants.HashZero;
        let tx = await factory.deployAccount(salt);
        let txMined = await tx.wait();

        const AbiEncoder = new ethers.utils.AbiCoder();
        const accountAddress = utils.create2Address(
            factory.address,
            await factory.aaBytecodeHash(),
            salt,
            AbiEncoder.encode(["uint"], [100])
        );

        console.log(`account address: ${accountAddress}`)

        const accAddress = utils.getDeployedContracts(txMined)[0].deployedAddress;
        // console.log(`acc address: ${accAddress}`)

        expect(accountAddress).to.equal(accAddress);

        account = new ethers.Contract(accountAddress, accountArtifact.abi, wallet);

        // THROWS ERROR
        // const storedValue = await account.storedValue();
        // console.log(`storedValue: ${storedValue}`)

        // THROWS ERROR
        const storedValue = await account.getStoredValue();
        console.log(`storedValue: ${storedValue}`)



    });



});