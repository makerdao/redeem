import React, { Component } from 'react';
import AnimatedNumber from 'react-animated-number';
import './App.css';
import Faq from './Faq';
import Stats from './Stats';
import Seth from './Seth';
import Footer from './Footer';
import Transaction from './Transaction';
import Undo from './Undo';
import web3, { initWeb3 } from './web3';

const dstoken_abi = require('./abi/dstoken.json');
const redeemer_abi = require('./abi/redeemer.json');

class App extends Component {

  state = {
    connected: null,
    account: null,
    error: null,
    network: null,
    deadline: null,
    currentTx: null,
    mkrBalanceRedeemer: new web3.BigNumber(0),
    mkrBalance: new web3.BigNumber(0),
    oldMkrBalance: new web3.BigNumber(0),
    mkrAllowance: new web3.BigNumber(0),
    oldMkrAllowance: new web3.BigNumber(0)
  }

  config = {
    kovan: {
      old_mkr_address: '0x4bb514a7f83fbb13c2b41448208e89fabbcfe2fb',
      mkr_address: '0x4572baca0e43504234f86380fcdd38fbf81c7888',
      redeemer_address: '0x2c0f31271673cc29927be725104642aad65a253e'
    },
    rinkeby: {
      old_mkr_address: '0xa2f6ee81945259b1e38149efeb8931c08a61e4f9',
      mkr_address: '0x62cf16573cd5613c415663265d51f775865d4dc5',
      redeemer_address: '0x2b7E91584A2EaC119E5c8A4dEb5b885f1b5763dD'
    },
    mainnet: {
      old_mkr_address: '0xc66ea802717bfb9833400264dd12c2bceaa34a6d',
      mkr_address: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
      redeemer_address: '0x642ae78fafbb8032da552d619ad43f1d81e4dd7c'
    }
  }

  url = null;

  old_mkr = null;
  redeemer = null;

  componentWillMount() {
    window.ethereum.enable();
    setTimeout(() => {
      initWeb3(web3);
      web3.version.getNetwork((error, network) => {
        if (error) {
          this.setState({
            error: `You don't seem to be connected to the Ethereum network. Please install Metamask and send MKR to the Metamask account to make the Redeem buttons available.`
          });
          return;
        }
        if (network === "1") {
          this.old_mkr_address = this.config.mainnet.old_mkr_address;
          this.mkr_address = this.config.mainnet.mkr_address;
          this.redeemer_address = this.config.mainnet.redeemer_address;
          this.url = "etherscan.io";
        } else if (network === "4") {
          this.old_mkr_address = this.config.rinkeby.old_mkr_address;
          this.mkr_address = this.config.rinkeby.mkr_address;
          this.redeemer_address = this.config.rinkeby.redeemer_address;
          this.url = "rinkeby.etherscan.io";
        } else if (network === "42") {
          this.old_mkr_address = this.config.kovan.old_mkr_address;
          this.mkr_address = this.config.kovan.mkr_address;
          this.redeemer_address = this.config.kovan.redeemer_address;
          this.url = "kovan.etherscan.io";
        } else {
          this.setState({
            error: `Please connect to mainnet or Kovan network for testing and refresh this page.`
          });
          return;
        }
        const old_mkr = web3.eth.contract(dstoken_abi).at(this.old_mkr_address);
        const mkr = web3.eth.contract(dstoken_abi).at(this.mkr_address);
        const redeemer = web3.eth.contract(redeemer_abi).at(this.redeemer_address);
        window.old_mkr = old_mkr;
        window.mkr = mkr;
        window.redeemer = redeemer;
        this.old_mkr = old_mkr;
        this.mkr = mkr;
        this.redeemer = redeemer;
        web3.eth.getAccounts((error, x) => {
          if (!error) {
            if (x.length > 0) {
              web3.eth.defaultAccount = x[0];
              this.setState({
                network,
                account: x[0]
              });
              this.getDeadline();
              this.checkAll();
              setInterval(this.checkAll, 5000);
            } else {
              this.setState({
                error: 'No account found. Do you need to unlock Metamask?'
              });
            }
          }
        });
      });
    }, 500);
  }

  getDeadline = () => {
    this.redeemer.undo_deadline((e, deadline) => {
      this.setState({ deadline });
    })
  }

  checkTransaction = (tx) => {
    return new Promise((resolve, reject) => {
      web3.eth.getTransactionReceipt(tx, (error, result) => {
        if (error) {
          reject(error);
        } else {
          result ? resolve(result.status) : resolve(null);
        }
      })
    });
  }

  checkAll = async () => {
    let currentTx = this.state.currentTx;
    if (currentTx) {
      const status = await this.checkTransaction(currentTx);
      if (status === '0x1') {
        currentTx = null;
      }
    }
    const mkrBalanceRedeemer = await this.getBalance(this.mkr, this.redeemer.address);
    const mkrBalance = await this.getBalance(this.mkr, this.state.account);
    const oldMkrBalance = await this.getBalance(this.old_mkr, this.state.account);
    const mkrAllowance = await this.getAllowance(this.mkr, this.state.account);
    const oldMkrAllowance = await this.getAllowance(this.old_mkr, this.state.account);
    this.setState({
      mkrBalanceRedeemer,
      mkrBalance,
      oldMkrBalance,
      mkrAllowance,
      oldMkrAllowance,
      currentTx
    });
  }

  getBalance = (token, account) => {
    return new Promise((resolve, reject) => {
      token.balanceOf(account, (error, balance) => {
        if (!error) {
          resolve(balance);
        } else {
          reject(error);
        }
      });
    })
  }

  getAllowance = (token, account) => {
    return new Promise((resolve, reject) => {
      token.allowance(account, this.redeemer_address, (error, balance) => {
        if (!error) {
          resolve(balance);
        } else {
          reject(error);
        }
      });
    })
  }

  approve = (e) => {
    e.preventDefault();
    this.old_mkr.approve(this.redeemer_address, this.state.oldMkrBalance, (e, r) => {
      if (!e) {
        this.setState({
          currentTx: r
        })
      }
    })
  }

  approve_undo = (e) => {
    e.preventDefault();
    this.mkr.approve(this.redeemer_address, this.state.mkrBalance, (e, r) => {
      if (!e) {
        this.setState({
          currentTx: r
        })
      }
    })
  }

  redeem = (e) => {
    e.preventDefault();
    this.redeemer.redeem((e, r) => {
      if (!e) {
        this.setState({
          currentTx: r
        })
      }
    })
  }

  undo = (e) => {
    e.preventDefault();
    this.redeemer.undo((e, r) => {
      if (!e) {
        this.setState({
          currentTx: r
        })
      }
    })
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <h1 className="text-center title">
                Redeem New MKR
              </h1>
              <p>
                Although the original MKR token was designed to be upgraded in-place, we have since transitioned to a "box"-oriented architecture where components can be individually verified much more easily, allowing the system as a whole to be analyzed in a manageable way.
                The new version of the MKR token will be a <a href="https://github.com/dapphub/ds-token" target="_blank" rel="noopener noreferrer">ds-token</a> object which can be configured to enable protected operations (e.g. burning MKR tokens) by future Dai iterations.
               </p>
              <h3>
                There is no deadline for this upgrade. You can do it any time and you will not be penalized in any way.
              </h3>
              <h3>
                This process is one way only. If you convert old MKR to new MKR, you won't be able to convert back to old MKR.
              </h3>
            </div>
          </div>
          {this.state.network &&
            <div>
              <div className="row">
                <div className="col-md-12">
                  <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Warning!</h4>
                    <p className="mb-0">
                      DO NOT send tokens directly to the contract. Use the Redeemer buttons below or (for advanced users) the command line interface instructions below.
                    </p>
                  </div>
                </div>
                <div className="col-md-12">
                  {this.state.account &&
                    <p>
                      Your account: <strong>{this.state.account}</strong>
                    </p>
                  }
                </div>
                <div className="col-md-6 text-center">
                  <p>
                    Your balance:
                  </p>
                  <p className="h1">
                    <AnimatedNumber value={web3 && web3.fromWei(this.state.oldMkrBalance).toNumber()} /> old MKR
                  </p>
                  {this.state.oldMkrBalance.gt(0) &&
                    !this.state.oldMkrBalance.eq(this.state.oldMkrAllowance) &&
                    !this.state.currentTx &&
                    <form onSubmit={this.approve}>
                      <button type="input" className="btn btn-primary">Step 1 - Approve</button>
                      <p>
                        This transaction will approve the Redeemer to exchange your tokens.
                      </p>
                    </form>
                  }
                  {this.state.oldMkrAllowance.gt(0) &&
                    this.state.oldMkrAllowance.eq(this.state.oldMkrBalance) &&
                    !this.state.currentTx &&
                    <form onSubmit={this.redeem}>
                      <button type="input" className="btn btn-primary">
                        Step 2 - Redeem {web3.fromWei(this.state.oldMkrAllowance).toString()} MKR
                      </button>
                      <p>
                        This transaction will remove your old MKR balance and replace it with new MKR tokens.
                      </p>
                    </form>
                  }
                </div>
                <div className="col-md-6 text-center">
                  <p>
                    Your balance:
                  </p>
                  <p className="h1">
                    <AnimatedNumber value={web3 && web3.fromWei(this.state.mkrBalance).toNumber()} /> MKR
                  </p>
                </div>
              </div>
              <Transaction currentTx={this.state.currentTx} url={this.url} />
              <Stats supply={1000000} available={web3.fromWei(this.state.mkrBalanceRedeemer).toNumber()} />
            </div>
          }
          {this.state.error &&
            <div className="alert alert-warning" role="alert">
              <h4 className="alert-heading">Attention needed</h4>
              <p className="mb-0">{this.state.error}</p>
            </div>
          }
          <Faq />
          {this.state.network &&
            <Undo approve={this.approve_undo} undo={this.undo} allowance={this.state.mkrAllowance} balance={this.state.mkrBalance} currentTx={this.state.currentTx} />
          }
          <Seth account={this.state.account} redeemer={this.redeemer_address} mkr={this.mkr_address} old_mkr={this.old_mkr_address} />
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
