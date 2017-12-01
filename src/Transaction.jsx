import React from 'react';

export default (props) => {
  return (
    <div className="row justify-content-center">
      {props.currentTx &&
        <div className="col-6">
          <div className="progress">
            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{width: '75%'}}></div>
          </div>
          <p>
            Your transaction is on the way! Please do not close your browser.<br />
            <a href={`https://${props.url}/tx/${props.currentTx}`} target="_blank" rel="noopener noreferrer">Monitor transaction on Etherscan</a>
          </p>
        </div>
      }
    </div>
  )
}
