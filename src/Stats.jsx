import React from 'react';

export default (props) => {
  const formatter = new Intl.NumberFormat('en-US');
  return (
    <div className="row justify-content-center">
      <div className="col-6">
        <p className="text-center h1">
          STATS
        </p>
        <table className="table">
          <tbody>
            <tr>
              <td>Total Supply</td>
              <td className="text-right">
                <strong>{formatter.format(props.supply)} MKR</strong>
              </td>
            </tr>
            <tr>
              <td>Redeemed</td>
              <td className="text-right">
                <strong>{formatter.format(props.supply - props.available)} MKR</strong>
              </td>
            </tr>
            <tr>
              <td>Remaining</td>
              <td className="text-right">
                <strong>{formatter.format(props.available)} MKR</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
