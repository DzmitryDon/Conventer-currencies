import React from "react";
import "./../styles/CurrencyHeader.css";

export const CurrencyHeader = (props) => {
  const { currentDate, rateEur, rateUsd } = props;
  const headerStr = `Курсы валют на дату: ${currentDate}`;
  const rates = `EUR = ${rateEur} UAH  USD = ${rateUsd} UAH`;

  return (
    <>
      <div className="currentDate"> {headerStr} </div>
      <div className="currentRate"> {rates} </div>
    </>
  );
};
