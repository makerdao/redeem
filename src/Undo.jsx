import React from 'react';

const Undo = (props) => {

  return (
    <div className="row">
      <div className="col-md-12">
        <h5>
          Can I get redeem new MKR for old MKR?
        </h5>
        <p>Yes, but only until February 28, 2018 at midnight UTC.</p>
        {props.balance.gt(0) &&
          props.allowance.lt(props.balance) &&
          !props.currentTx &&
          <p>
            <a href="#approve" onClick={props.approve}>Click here</a> to start the 2-step process.
          </p>
        }
        {props.balance.gt(0) &&
          props.allowance.gte(props.balance) &&
          !props.currentTx &&
          <p>
            Step 1 done! <a href="#approve" onClick={props.undo}>Click here</a> to finish the process. You will get back old MKR in exchange for new MKR.
          </p>
        }
        {props.currentTx &&
          <p>
            Please wait while your transaction is mined.
          </p>
        }
      </div>
    </div>
  )
}

export default Undo;
