import React, { useEffect, useState } from "react";
import "./../styles/CurrencyExchange.css";

import { CurrencyRow } from "./CurrencyRow";
import { CurrencyHeader } from "./CurrencyHeader";

const BASE_URL =
  "http://api.exchangeratesapi.io/v1/latest?access_key=7c83065c95b7e82dee5ba9eb72f05b88";

const currenciesBase = {
  usd: "USD",
  uah: "UAH",
};

export const CurrencyExchange = () => {
  const [rateEur, setRateEur] = useState(0);
  const [rateUsd, setRateUsd] = useState(0);
  const [currentDate, setCurrentDate] = useState("0001-01-01");

  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [exchangeRate, setExchangeRate] = useState(1);
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);
  const [isError, setIsError] = useState(false);

  function roundPlus(x, n) {
    if (isNaN(x) || isNaN(n)) return 0;

    const m = Math.pow(10, n);

    return Math.round(x * m) / m;
  }

  let toAmount, fromAmount;
  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRate;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  }

  useEffect(() => {
    fetch(BASE_URL)
      .then((res) => res.json())
      .then((data) => {
        setRateEur(data.rates[currenciesBase.uah]);
        setRateUsd(
          roundPlus(
            data.rates[currenciesBase.uah] / data.rates[currenciesBase.usd],
            6
          )
        );

        const firstCurrency = Object.keys(data.rates)[0];
        setCurrencyOptions([data.base, ...Object.keys(data.rates)]);
        setFromCurrency(data.base);
        setToCurrency(firstCurrency);
        setExchangeRate(data.rates[firstCurrency]);
        setCurrentDate(data.date);
      })
      .catch((e) => {
        setIsError(true);
        alert("Error: " + e.message);
      });
  }, []);

  useEffect(() => {
    if (fromCurrency !== undefined && toCurrency !== undefined) {
      fetch(`${BASE_URL}&base=${fromCurrency}&symbols=${toCurrency}`)
        .then((res) => res.json())
        .then((data) => setExchangeRate(data.rates[toCurrency]))
        .catch((e) => {
          alert("Error: " + e.message);
        });
    }
  }, [fromCurrency, toCurrency]);

  function handleFromAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(true);
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(false);
  }

  if (isError) {
    return <h1 className="infoInCorrect">Данные о курсах валют отсутствуют</h1>;
  } else {
    return (
      <>
        <h1 className="infoCorrect">Конвентер валют</h1>

        <CurrencyHeader
          currentDate={currentDate}
          rateEur={rateEur}
          rateUsd={rateUsd}
        />

        <CurrencyRow
          currencyOptions={currencyOptions}
          selectedCurrency={fromCurrency}
          onChangeCurrency={(e) => setFromCurrency(e.target.value)}
          onChangeAmount={handleFromAmountChange}
          amount={fromAmount}
        />

        <div className="equals">=</div>

        <CurrencyRow
          currencyOptions={currencyOptions}
          selectedCurrency={toCurrency}
          onChangeCurrency={(e) => setToCurrency(e.target.value)}
          onChangeAmount={handleToAmountChange}
          amount={toAmount}
        />
      </>
    );
  }
};
