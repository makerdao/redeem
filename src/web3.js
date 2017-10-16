import Web3 from 'web3';

const web3 = new Web3();

const initWeb3 = (web3) => {
  if (window.web3) {
    web3.setProvider(window.web3.currentProvider);
    window.web3 = web3;
  }
}

export default web3;
export { initWeb3 };
