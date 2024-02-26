'use client';

import { GameContext } from "@/context/game";
import { useContext, useEffect, useState } from "react";
import { BsFillMouseFill } from "react-icons/bs";

const convertMoneyString = (money:number) => {
  if (money > 1000000000) {
    const convert = money.toString().slice(0, -8);
    const formatted = convert.substring(0, convert.length - 1) + '.' + convert[convert.length - 1]
    return `${formatted}B`
  }
  else if (money > 1000000) {
    const convert = money.toString().slice(0, -5);
    const formatted = convert.substring(0, convert.length - 1) + '.' + convert[convert.length - 1]
    return `${formatted}M`
  }
  return `${money},00`
}


export default function Home() {
  const gameContext = useContext(GameContext);

  const handleClick = () => {
    gameContext.setState((pv:any) => ({...pv, moneyTotal: pv.moneyTotal + 1}))
  }

  return (
    <main>
      <div className="container">
        <div className="money">
          <span className="money__currency">R$ {convertMoneyString(gameContext.moneyTotal)}</span>
        </div>
        <div className="clicker">
          <button onClick={handleClick}>
            <BsFillMouseFill className="icon"/>
          </button>
        </div>
        <div className="businesses">
          <Business title="Internet's Friend Help" description="Espalhe correntes para forçarem a te ajudar" money={20} timeRefresh={5} priceBuy={2}/>
          <Business title="Bot Help" description="Pague bots de todos os locais do mundo para clicarem por você" money={1000} timeRefresh={10} priceBuy={200}/>
          <Business title="AI Help" description="Ela clica em tudo, menos no recaptcha" money={100000} timeRefresh={20} priceBuy={20000}/>
          <Business title="Bot Help" description="Pague bots de todos os locais do mundo para clicarem por você" money={10000000} timeRefresh={40} priceBuy={2000000}/>
          <Business title="Bot Help" description="Pague bots de todos os locais do mundo para clicarem por você" money={1000000000} timeRefresh={80} priceBuy={200000000}/>
          <Business title="Bot Help" description="Pague bots de todos os locais do mundo para clicarem por você" money={100000000000} timeRefresh={160} priceBuy={2000000000}/>
        </div>
      </div>
    </main>
  )
}

function Business ({title, description, money, timeRefresh, priceBuy} : any) {
  const [state, setState] = useState({
    quantity: 0,
    quantityNext: 25,
    money: money,
    timeRefresh: timeRefresh,
    timeCount: 0,
    priceBuy: priceBuy,
    isActive: false,
    interval: null as any
  });

  const gameContext = useContext(GameContext);

  const handleBuy = () => {
    if (gameContext.moneyTotal >= state.priceBuy) {
      const stateUpdates = {
        money: Math.ceil(state.money + (state.money * 0.1)),
        quantity: state.quantity + 1,
        quantityNext: state.quantityNext,
        priceBuy: Math.ceil(state.priceBuy + (state.priceBuy * 0.25)),
        timeRefresh: state.timeRefresh,
        isActive: true,
        timeCount: 0,
      }

      if (stateUpdates.quantity >= state.quantityNext) {
        const timeRefresh = state.timeRefresh - (Math.ceil(state.timeRefresh * 0.5));
        stateUpdates.quantityNext = state.quantityNext * 2;
        stateUpdates.timeRefresh = timeRefresh < 0.5 ? 0.25 : timeRefresh;
      }

      gameContext.setState((pv: any) => ({...pv, moneyTotal: gameContext.moneyTotal - state.priceBuy}))
      setState((pv) => ({...pv, ...stateUpdates}));
    }
  }

  useEffect(() => {
    if (state.isActive) {
      if (state.interval) {
        clearInterval(state.interval);
      }

      const interval = setInterval(() => {
        gameContext.setState((pv: any) => ({...pv, moneyTotal: pv.moneyTotal + state.money}));
        setState((pv) => ({...pv, timeCount: 0}));
      }, state.timeRefresh * 1000);

      setState((pv) => ({...pv, interval: interval}));
    }

    return (() => {
      clearInterval(state.interval);
    })
  }, [state.timeRefresh, state.isActive, state.money]);

  useEffect(() => {
    if(state.isActive) {
      const timerInterval = setInterval(() => {
        setState((pv) => ({...pv, timeCount: pv.timeCount + (1 / 24)}));
      },1000 / 24);

      return (() => {
        clearInterval(timerInterval);
      })
    }
  }, [state.isActive])

  return (
    <div className="business">
      <div className="business__imageContainer">
        <div className="business__image">
          <BsFillMouseFill className="icon"/>
        </div>
        <div className="progressBar">
          <span>{state.quantity} / {state.quantityNext}</span>
        </div>
      </div>
      <div className="business__details">
        <span className="business__title">
          {title}
          <span>{description}</span>
        </span>
        <div className="progressBar" style={{background: `linear-gradient(90deg, green ${(state.timeCount * 100) / state.timeRefresh}%, black 1%)`}}>
          <span>{state.timeRefresh} - R$ {convertMoneyString(state.money)}</span>
        </div>
      </div>
      <button onClick={handleBuy}>
        Buy
        <span> R$ {convertMoneyString(state.priceBuy)}</span>
      </button>
    </div>
  )
}
