import React from 'react';

export default (props) => {
  return (
    <div className="row justify-content-center">
      {props.currentTx &&
        <div className="col-6">
          <p>
            Your transaction is on the way! Please do not close your browser.<br />
            <a href={`https://${props.url}/tx/${props.currentTx}`} target="_blank" rel="noopener noreferrer">Monitor transaction on Etherscan</a>
          </p>
        </div>
      }
    </div>
  )
}
