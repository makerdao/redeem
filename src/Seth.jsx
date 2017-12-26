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
export ETH_GAS=200000 # gas to send per transaction
export ETH_FROM=${props.account || `[YOUR ACCOUNT]`} # your account
export REDEEMER=${props.redeemer || `0x642ae78fafbb8032da552d619ad43f1d81e4dd7c`} # redeemer contract
export OLD_MKR=${props.old_mkr || `0xc66ea802717bfb9833400264dd12c2bceaa34a6d`} # old MKR token
export MKR=${props.mkr || `0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2`} # new MKR token
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
