import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { CakeToken, CakeToken__factory, MasterChef, MasterChef__factory, SyrupBar, SyrupBar__factory, Token1, Token1__factory, Token2, Token2__factory, Token3, Token3__factory } from "../typechain-types";
import { addressFromNumber, expandTo18Decimals } from "./utilities/utilities";
describe("Master chef",async()=>{
    let owner:SignerWithAddress;
    let signers:SignerWithAddress[];
    let user1:SignerWithAddress;
    let user2:SignerWithAddress;
    let user3:SignerWithAddress;
    let lptoken:Token1;
    let lptoken1:Token2;
    let lptoken2:Token3;
    let cakeToken:CakeToken;
    let syrupbar:SyrupBar;
    let masterchef:MasterChef;
    beforeEach("Initialize",async()=>{
        signers=await ethers.getSigners();
        owner=signers[0];
        user1=signers[1];
        user2=signers[2];
        user3=signers[3];
        lptoken=await new Token1__factory(owner).deploy("lptoken","lp",300);
        lptoken1=await new Token2__factory(owner).deploy("lptoken1","lp1",200);
        lptoken2=await new  Token3__factory(owner).deploy("lptoken2","lp2",200);
        cakeToken=await new CakeToken__factory(owner).deploy();
        syrupbar=await new SyrupBar__factory(owner).deploy(cakeToken.address);
        masterchef=await new MasterChef__factory(owner).deploy(cakeToken.address,syrupbar.address,owner.address,expandTo18Decimals(30),1);
        console.log("masterchef" , await masterchef.address);
        await cakeToken.connect(owner).transferOwnership(masterchef.address) ;
        await syrupbar.connect(owner).transferOwnership(masterchef.address) ;
        // console.log(await masterchef.connect(owner).add(1,lptoken.address,true));
        // await masterchef.connect(owner).add(2,lptoken1.address,true);
        // await masterchef.connect(owner).add(3,lptoken2.address,true);
        // await lptoken.connect(owner).mint(user1.address,expandTo18Decimals(200));
        // await lptoken.connect(owner).mint(user2.address,expandTo18Decimals(100));
        // await lptoken.connect(owner).mint(user3.address,expandTo18Decimals(100));
        // await lptoken.connect(user1).approve(masterchef.address,expandTo18Decimals(100));
        // await lptoken.connect(user2).approve(masterchef.address,expandTo18Decimals(100));
        // await lptoken.connect(user3).approve(masterchef.address,expandTo18Decimals(100));
        // console.log("2");
        // await masterchef.connect(user1).deposit(1,expandTo18Decimals(100));
        // await masterchef.connect(user2).deposit(1,expandTo18Decimals(100));
        // await masterchef.connect(user3).deposit(1,expandTo18Decimals(100));
        // console.log("3");

        // await lptoken.connect(user2).approve(masterchef.address,expandTo18Decimals(100));
        // console.log(await lptoken.connect(user3).approve(masterchef.address,expandTo18Decimals(100)));
        // console.log(await lptoken.balanceOf(user1.address));

    })
    describe("Testing pancakeswap",async()=>{
        it("checking pool information",async()=>{
            const info=await masterchef.poolInfo(1);
            console.log(info);

        })
        it("checking totalallocation point",async()=>{
            await masterchef.connect(owner).add(50,lptoken.address,true);
            await masterchef.connect(owner).add(30,lptoken1.address,true);
            // await masterchef.connect(owner).add(20,lptoken2.address,true);
            const alloc=await masterchef.totalAllocPoint();
            const poolinfo=await masterchef.poolInfo(0);
            const poolinfo1=await masterchef.poolInfo(1);

            console.log(alloc,"alloc");
            console.log(poolinfo,"poolinfo");
            console.log(poolinfo1,"poolinfo1");
            


        })
        it("Pool length",async()=>{
            await masterchef.connect(owner).add(50,lptoken.address,true);
            await masterchef.connect(owner).add(30,lptoken1.address,true);
            await masterchef.connect(owner).add(20,lptoken2.address,true);
            const length=await masterchef.poolLength();
            console.log(length);
        })
        it("transferOwnerShip of cake and syrup pool",async()=>{
            await cakeToken.connect(owner).transferOwnership(masterchef.address) ;
            await syrupbar.connect(owner).transferOwnership(masterchef.address) ;
        })
        it("creating farms for user ",async()=>{
            var a=await masterchef.connect(owner).add(50,lptoken.address,true);
            console.log(a);owner
            var b=await masterchef.connect(owner).add(30,lptoken1.address,true);
            console.log(b);
            var c=await masterchef.connect(owner).add(20,lptoken2.address,true);
            console.log(c);


        })
        it("depositing lptokens from user",async()=>{
            console.log(await cakeToken.balanceOf(user1.address));

            await lptoken.connect(owner).mint(user1.address,expandTo18Decimals(100));
            await lptoken.connect(owner).mint(user2.address,expandTo18Decimals(100));
            await lptoken.connect(owner).mint(user3.address,expandTo18Decimals(100));
            await lptoken.connect(user1).approve(masterchef.address,expandTo18Decimals(100));
            console.log("2");
            await masterchef.connect(user1).deposit(1,expandTo18Decimals(100));
            console.log("3");

            await lptoken.connect(user2).approve(masterchef.address,expandTo18Decimals(100));
            await lptoken.connect(user3).approve(masterchef.address,expandTo18Decimals(100));
            console.log(await lptoken.balanceOf(user1.address));
            
            
            console.log(Number(await masterchef.pendingCake(1,user1.address)),"cake token balance or free cake");
            console.log("hii");
            console.log(await masterchef.owner());
            
            console.log("cake before", Number(await cakeToken.balanceOf(user1.address)));
            console.log("lptoken bal bef",await lptoken.balanceOf(user1.address));
        })
        it("pending cake",async()=>{
           const up= await masterchef.pendingCake(1,user1.address);
           console.log(up);

        })
        it("update and set",async()=>{
            await cakeToken.connect(owner).transferOwnership(masterchef.address) ;
            await syrupbar.connect(owner).transferOwnership(masterchef.address) ;
            await masterchef.connect(owner).add(50,lptoken.address,true);
            await masterchef.connect(owner).add(30,lptoken1.address,true);
            await masterchef.connect(owner).add(20,lptoken2.address,true);
            await masterchef.set(2,40,true);
            const update=await masterchef.poolInfo(2);
            console.log(update.allocPoint);
            console.log("Total allocation point",await masterchef.totalAllocPoint());
        })                                                                                                                                                                                                                                                                                                      
        it.only("checking withdrawing function",async()=>{
            await masterchef.connect(owner).add(50,lptoken.address,true);
            await masterchef.connect(owner).add(30,lptoken1.address,true);
            await masterchef.connect(owner).add(20,lptoken2.address,true);
            await lptoken.connect(owner).mint(user1.address,expandTo18Decimals(100));
            await lptoken.connect(owner).mint(user2.address,expandTo18Decimals(100));
            await lptoken.connect(owner).mint(user3.address,expandTo18Decimals(100));
            await lptoken.connect(user1).approve(masterchef.address,expandTo18Decimals(100));
            await lptoken.connect(user2).approve(masterchef.address,expandTo18Decimals(100));
            await lptoken.connect(user3).approve(masterchef.address,expandTo18Decimals(100));
            console.log(await masterchef.connect(user1).deposit(1,expandTo18Decimals(100)));
            await masterchef.connect(user2).deposit(1,expandTo18Decimals(100));
            await masterchef.connect(user3).deposit(1,expandTo18Decimals(100));

            // const DepositDetail = await masterchef.userInfo(1, user1.address);                        //getting user info
            // const allocUserAmount = DepositDetail.amount;   
            // console.log(allocUserAmount,"allocation user amount");
            // await masterchef.connect(user1).withdraw(1,allocUserAmount);
            console.log(await masterchef.connect(user1).withdraw(1,expandTo18Decimals(100)));
            console.log("cake after", Number(await cakeToken.balanceOf(user1.address)));
            console.log("lptoken bal aft",await lptoken.balanceOf(user1.address));


            // console.log(await lptoken.balanceOf(user1.address));
            // var a= await cakeToken.balanceOf(user1.address);
            // console.log(Number(a),"a");


        })
        it("Emergency Withdrawl",async()=>{
            await masterchef.connect(owner).add(50,lptoken.address,true);
            await masterchef.connect(owner).add(30,lptoken1.address,true);
            await masterchef.connect(owner).add(20,lptoken2.address,true);
            await lptoken.connect(owner).mint(user1.address,expandTo18Decimals(100));
            await lptoken.connect(owner).mint(user2.address,expandTo18Decimals(100));
            await lptoken.connect(owner).mint(user3.address,expandTo18Decimals(100));
            await lptoken.connect(user1).approve(masterchef.address,expandTo18Decimals(100));
            await masterchef.connect(user1).deposit(1,expandTo18Decimals(100));
            await masterchef.connect(user1).emergencyWithdraw(1);
            console.log(await lptoken.balanceOf(user1.address));
            var a= await cakeToken.balanceOf(user1.address);
            console.log(Number(a),"cake token");

        })
        it("Reverted due to less approval for deposit",async()=>{
            await masterchef.connect(owner).add(50,lptoken.address,true);
            await masterchef.connect(owner).add(30,lptoken1.address,true);
            await masterchef.connect(owner).add(20,lptoken2.address,true);
            await lptoken.connect(owner).mint(user1.address,expandTo18Decimals(100));
            await lptoken.connect(owner).mint(user2.address,expandTo18Decimals(100));
            await lptoken.connect(owner).mint(user3.address,expandTo18Decimals(100));
            await lptoken.connect(user1).approve(masterchef.address,expandTo18Decimals(80));
            await expect( masterchef.connect(user1).deposit(1,expandTo18Decimals(100))).revertedWith('ERC20: transfer amount exceeds allowance');

        })
        
    })

})
    

