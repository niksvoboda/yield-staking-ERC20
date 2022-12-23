//адрес стейкингового контракта
const addressStaking = "0xAa4067D01560E69928Ecd20E0059715B0Ce08628"; 
//адрес стейктокена
const addressStakeToken = "0x987DD75d932c8B70219998e0d545641280B66698"; 

let ifAlowance = false; 

let connectButton = document.getElementById('connect'); 
let approveButton = document.getElementById('approve'); 
let stakeButton = document.getElementById('stake'); 
let unStakeButton = document.getElementById('unstake'); 
let claimTokensButton = document.getElementById('claim'); 
let yieldInfo = document.getElementById('yield');
let stakedInfo = document.getElementById('staked');
let balanceInfo = document.getElementById('balance');

let counttokens = document.getElementById('counttokens'); 

let     connectButtonShow = false;
let     stakeButtonShow = false;
let     unStakeButtonShow = false;
let     approveButtonShow = false;
let     claimTokensButtonShow = false;


//ABI логики
const StakingAbi = [{"inputs":[{"internalType":"address","name":"_StakeToken","type":"address"},{"internalType":"address","name":"_YieldToken","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"claimTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"farmers","outputs":[{"internalType":"uint256","name":"money","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserYield","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_yieldRate","type":"uint256"}],"name":"setYieldRate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"stakeTokenAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"unstake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"yieldRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"yieldTokenAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}];
const StakeTokenAbi =  [{"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"},{"internalType":"uint256","name":"totalSupply_","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];


document.addEventListener("DOMContentLoaded", function(){
    counttokens.value = 100; 
   _counttokens = counttokens.value; 
});

function connect() {
    ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(handleAccountsChanged)
      .catch((error) => {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          console.log('Please connect to MetaMask.');
        } else {
          console.error(error);
        }
      });
}

connectButton.addEventListener('click', () => {
    connect();
});


async function detectWallet(){
    
    const provider = await detectEthereumProvider();
   
    if (typeof provider !== 'undefined' || (typeof provider !== 'undefined')) 
        {
        let currentUserAccount = null;
        
        console.log('Metamask ready');
        //Создаем контракты для работы
        const web3 = new Web3(Web3.givenProvider);
        const contractStakeToken = new web3.eth.Contract(StakeTokenAbi, addressStakeToken);
        const contractStaking = new web3.eth.Contract(StakingAbi, addressStaking);
        // console.log(ethereum);
        
        function render(){
            connectButtonShow?      connectButton.style.display = "block"    : connectButton.style.display = "none";
            stakeButtonShow?        stakeButton.style.display = "block"      : stakeButton.style.display = "none";
            unStakeButtonShow?      unStakeButton.style.display = "block"    : unStakeButton.style.display = "none";
            approveButtonShow?      approveButton.style.display = "block"    : approveButton.style.display = "none";
            claimTokensButtonShow?  claimTokensButton.style.display = "block": claimTokensButton.style.display = "none";

            console.log(' '+connectButtonShow+' '+stakeButtonShow+' '+unStakeButtonShow+' '+approveButtonShow+' '+ claimTokensButtonShow)
        }

        //Когда юзер подключит кошелек запоминаем его аккаунт    
        function checkUserAccount(){
            ethereum
            .request({ method: 'eth_accounts' })
            .then((handleAccountsChanged)=>{
            currentUserAccount = handleAccountsChanged[0];
            //если аккаунт подключен чекаем апррув на расход токенов
            if(handleAccountsChanged[0]){
                allowanceCheck();
                balanceInfoGet();
                yieldInfoGet();
                stakedInfoGet();
                connectButtonShow = false;
                render();
             } else {
                //если аккаунт отключился скрываем кнопки кроме коннекта
                connectButtonShow = true;
                stakeButtonShow = false;
                unStakeButtonShow = false;
                approveButtonShow = false;
                claimTokensButtonShow = false;

                render();
            }
            })
            .catch((err) => {
                console.error(err);
            });    
            setTimeout(() => {
                checkUserAccount();
            }, 3000)
        }
        checkUserAccount();
    
        //узнаем есть ли апррув
        function allowanceCheck(){
            console.log(currentUserAccount);
            contractStakeToken.methods.allowance(currentUserAccount, addressStaking).call((err, result) => {
            if(result.toString().length > 2){
                approveButtonShow = false;
                stakeButtonShow = true;

            } else {
                approveButtonShow = true;
                stakeButtonShow = false;
            }
       
            console.log('aprove: ' + result);
            });
            //чекаем каждые 3 секунды
        }

        function approve(){
            const gasqount = 10**5;
            let maxAllowance = '1000000000000000000000000000000000000';
            maxAllowance = maxAllowance.toString();
            const data = contractStakeToken.methods.approve(addressStaking, maxAllowance).encodeABI();
            ethereum.request({ 
            method: 'eth_sendTransaction',
            params: [
            {
            from: ethereum.selectedAddress,
            to: addressStakeToken,
            //value:  web3.utils.toHex(currentValue),
            //gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
            gas: web3.utils.toHex(gasqount),
            data: data
            },
            ],
            })
            .then((txHash) => console.log(txHash))
            .catch((error) => console.error);
        }
        
        approveButton.addEventListener('click', () => {
            approve();
        });

        function stake(){
            const gasqount = 2*10**5;
            const counttokens = _counttokens + '000000000000000000';
            const data = contractStaking.methods.deposit(counttokens).encodeABI();
            ethereum.request({ 
            method: 'eth_sendTransaction',
            params: [
            {
            from: ethereum.selectedAddress,
            to: addressStaking,
            //value:  web3.utils.toHex(currentValue),
            //gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
            gas: web3.utils.toHex(gasqount),
            data: data
            },
            ],
            })
            .then((txHash) => console.log(txHash))
            .catch((error) => console.error);
        }
        
        stakeButton.addEventListener('click', () => {
            stake();
        });



        function unStake(){
            const gasqount = 2*10**5;
            const data = contractStaking.methods.unstake().encodeABI();
            ethereum.request({ 
            method: 'eth_sendTransaction',
            params: [
            {
            from: ethereum.selectedAddress,
            to: addressStaking,
            //value:  web3.utils.toHex(currentValue),
            //gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
            gas: web3.utils.toHex(gasqount),
            data: data
            },
            ],
            })
            .then((txHash) => console.log(txHash))
            .catch((error) => console.error);
        }
        
        unStakeButton.addEventListener('click', () => {
            unStake()
        });


        function claimTokens(){
            const gasqount = 10**6;
            const data = contractStaking.methods.claimTokens().encodeABI();
            ethereum.request({ 
            method: 'eth_sendTransaction',
            params: [
            {
            from: ethereum.selectedAddress,
            to: addressStaking,
            //value:  web3.utils.toHex(currentValue),
            //gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
            gas: web3.utils.toHex(gasqount),
            data: data
            },
            ],
            })
            .then((txHash) => console.log(txHash))
            .catch((error) => console.error);
        }
        
        claimTokensButton.addEventListener('click', () => {
            claimTokens()
        });

        function yieldInfoGet(){ 
            contractStaking.methods.getUserYield(currentUserAccount).call((err, result) => {
                if(result>0){
                    let s = result.slice(0, -9); 
                    yieldInfo.textContent =  s / (10**9);
                        claimTokensButtonShow = true;
                        
                    }else{
                        claimTokensButtonShow = false;
                    }
                             
                console.log(result);
                });
        }

        function stakedInfoGet(){ 
            contractStaking.methods.farmers(currentUserAccount).call((err, result) => {
                if(result['money']>0){
                    let s = result['money'].slice(0, -9); 
                    stakedInfo.textContent =  s / (10**9);
                    unStakeButtonShow = true;
                } else {
                    stakedInfo.textContent =  0;
                    unStakeButtonShow = false;
                }
                
                
                });
        }

        function balanceInfoGet(){ 
            contractStakeToken.methods.balanceOf(currentUserAccount).call((err, result) => {
          

                if(result >0){
                    let s = result.slice(0, -9); 
                    balanceInfo.textContent =  s / (10**9);
                    console.log('balance: '+ s/ (10**9));   

                    stakeButtonShow = true;
                } else {
                    stakedInfo.textContent =  0;
                    stakeButtonShow = false;
                }
            });
        }
        


         
    } else {
        let web3 = new Web3(provider_);
        const contract = new web3.eth.Contract(abi, address);
        console.log('Metamask noready');
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        let mintButton = document.getElementById('mintButton');	
        mintButton.innerHTML = '<a class="btn-large btn-skin btn-animation" style="background-color:orange" href="https://metamask.app.link/dapp/zeisi.space/" target="blank" style="color:white;" >Install</a> ';
        } else {
        let mintButton = document.getElementById('mintButton');	
        mintButton.innerHTML = '<a class="btn-large btn-skin btn-animation" style="background-color:orange" href="https://metamask.io/download.html" target="blank" style="color:white;">Install</a>';
        }
    }






}
detectWallet();






