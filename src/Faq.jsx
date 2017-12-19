import React from 'react';

export default () => {
  return (
    <div className="row">
      <div className="col-md-12">
        <p className="text-center h1">
          FAQ
        </p>
        <h5>
          What are the token addresses?
        </h5>
        <p>
          Please always verify that you are interacting with the correct tokens.
        </p>
        <p>
          MKR token: <a href="https://etherscan.io/token/Maker" target="_blank" rel="noopener noreferrer">0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2</a>
        </p>
        <p>
          DAI Stablecoin v1.0 token: <a href="https://etherscan.io/token/0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359" target="_blank" rel="noopener noreferrer">0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359</a>
        </p>
        <h5>
          Can I see the source code?
        </h5>
        <p>
          Yes! This dapp is hosted on GitHub Pages and the source code can be found at <a href="https://github.com/makerdao/redeem" target="_blank" rel="noopener noreferrer">https://github.com/makerdao/redeem</a>
        </p>
      </div>
    </div>
  )
}
