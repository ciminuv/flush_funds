import React, { useEffect } from 'react';
import { ethers }  from 'ethers';
import Forwarder from '../src/Forwarder.json';
import './App.css';

function App() {
  const flush = (operationHandler) => {
    const address = contractAddress();
    let provider = null;

    if(typeof window.ethereum !== 'undefined') {
      provider = window['ethereum'];
    } else {
      window.alert("Please install MetaMask!!");
      return;
    }

    provider.enable().then((accounts) => {
      let ethersProvider = new ethers.providers.Web3Provider(provider);
      let contract = new ethers.Contract(address, Forwarder.abi, ethersProvider.getSigner());
      return operationHandler(contract);
    }).then((transaction) => {
      window.alert(transaction.hash);
    }).catch(function (error) {
      window.alert(error.message);
    });
  };

  const flushETH = () => {
    flush((contract) => {
      return contract.flush();
    });
  };

  const flushPalomaUSDT = () => {
    flush((contract) => {
      return contract.flushTokens("0xe251b8b9f576c208c18bd6247c74bc111844d336");
    });
  };

  const contractAddress = () => {
    const defaultAddress = "0xC6a865a1C47c0F9112678aFC357A431d70C941A1";
    const params = new URLSearchParams(window.location.search);
    const configContractAddress = params.get("contract");
    return configContractAddress || defaultAddress;
  };

  return (
    <div className="app">
      <div className="center-screen">
        <button onClick={flushETH}>Flush</button>
        <button onClick={flushPalomaUSDT}>Flush P USDT</button>
      </div>
    </div>
  );
}

export default App;
