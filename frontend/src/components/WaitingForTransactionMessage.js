import React from "react";

//and this

export function WaitingForTransactionMessage({ txHash }) {
  return (
    <div className="alert alert-info" role="alert">
      Waiting for transaction <strong>{txHash}</strong> to be mined
    </div>
  );
}
