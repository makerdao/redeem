import React from 'react';

export default (props) => {
  const formatter = new Intl.NumberFormat('en-US');
  return (
    <div className="row">
      <div className="col-md-6">
        <h2>Old MKR</h2>
      </div>
      <div className="col-md-6">
        <table className="table">
          <tbody>
            <tr>
              <td>Total Supply</td>
              <td className="text-right">{formatter.format(props.supply)} MKR</td>
            </tr>
            <tr>
              <td>Redeemed</td>
              <td className="text-right">{formatter.format(props.supply - props.available)} MKR</td>
            </tr>
            <tr>
              <td>Remaining</td>
              <td className="text-right">{formatter.format(props.available)} MKR</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
