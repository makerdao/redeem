import React from 'react';

export default (props) => {
  return (
    <div className="row">
      <div className="col-md-12">
        <h5>
          Can I do this process manually?
        </h5>
        <p>
          Of course! You can use <a href="https://dapp.tools/seth/" target="_blank" rel="noopener noreferrer">seth</a> to redeem your MKR tokens from the comfort of your command line.
        </p>
<pre className="seth-code rounded pl-3"><code>
{`
export ETH_GAS=150000 # gas to send per transaction
export ETH_GAS_PRICE=$(seth --to-wei 1 gwei) # price per gas unit
export ETH_FROM=${props.account || `[YOUR ACCOUNT]`} # your account
export REDEEMER=${props.redeemer} # redeemer contract
export OLD_MKR=${props.old_mkr} # old MKR token
export MKR=${props.mkr} # new MKR token
export MKR_BALANCE=$(seth call $OLD_MKR 'balanceOf(address)(uint256)' $ETH_FROM) # get old MKR balance
seth --to-dec $MKR_BALANCE | seth --to-fix 18 $(cat) # echo old MKR balance
seth send $OLD_MKR 'approve(address,uint256)' $REDEEMER $MKR_BALANCE # send approve transaction
seth send $REDEEMER 'redeem()' # send redeem MKR transaction
seth call $MKR 'balanceOf(address)(uint256)' $ETH_FROM | seth --to-dec | seth --to-fix 18 $(cat) # show new MKR balance

`}
</code></pre>
      </div>
    </div>
  )
}
