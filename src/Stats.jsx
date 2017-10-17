import React from 'react';
import AnimatedNumber from 'react-animated-number';

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
                <strong><AnimatedNumber value={props.supply} formatValue={x => formatter.format(x)} /> MKR</strong>
              </td>
            </tr>
            <tr>
              <td>
                Redeemed (<strong><AnimatedNumber value={(props.supply - props.available) / props.supply * 100} formatValue={x => formatter.format(x)} /> %</strong>)
              </td>
              <td className="text-right">
                <strong>
                  <AnimatedNumber value={props.supply - props.available} formatValue={x => formatter.format(x)} /> MKR
                  </strong>
              </td>
            </tr>
            <tr>
              <td>Remaining</td>
              <td className="text-right">
                <strong><AnimatedNumber value={props.available} formatValue={x => formatter.format(x)} /> MKR</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
