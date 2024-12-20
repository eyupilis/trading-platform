// Trading calculator utility functions

export const calculateRiskReward = (entryPrice, targetPrice, stopLoss, positionSize, leverage = 1) => {
  const entry = parseFloat(entryPrice);
  const target = parseFloat(targetPrice);
  const stop = parseFloat(stopLoss);
  const size = parseFloat(positionSize);
  const lev = parseFloat(leverage);

  if (!entry || !target || !stop || !size || !lev) {
    throw new Error('Invalid input parameters');
  }

  const isLong = target > entry;
  const riskPerUnit = Math.abs(entry - stop);
  const rewardPerUnit = Math.abs(target - entry);
  const riskRewardRatio = rewardPerUnit / riskPerUnit;

  const potentialProfit = (size * lev * rewardPerUnit) / entry;
  const potentialLoss = (size * lev * riskPerUnit) / entry;
  const liquidationPrice = isLong
    ? entry * (1 - 1 / lev)
    : entry * (1 + 1 / lev);

  return {
    riskRewardRatio,
    potentialProfit,
    potentialLoss,
    liquidationPrice,
    leverage: lev,
    effectivePosition: size * lev,
    isLong,
  };
};

export const calculatePositionSize = (accountSize, riskPercentage, entryPrice, stopLoss, leverage = 1) => {
  const entry = parseFloat(entryPrice);
  const stop = parseFloat(stopLoss);
  const risk = parseFloat(riskPercentage) / 100;
  const account = parseFloat(accountSize);
  const lev = parseFloat(leverage);

  if (!entry || !stop || !risk || !account || !lev) {
    throw new Error('Invalid input parameters');
  }

  const riskAmount = account * risk;
  const priceDistance = Math.abs(entry - stop);
  const positionSize = (riskAmount * entry) / (priceDistance * lev);

  return {
    positionSize,
    maxLoss: riskAmount,
    effectivePosition: positionSize * lev,
    leverage: lev,
  };
};

export const calculateBreakEven = (entryPrice, positionSize, fees, leverage = 1) => {
  const entry = parseFloat(entryPrice);
  const size = parseFloat(positionSize);
  const feeRate = parseFloat(fees) / 100;
  const lev = parseFloat(leverage);

  if (!entry || !size || !feeRate || !lev) {
    throw new Error('Invalid input parameters');
  }

  const totalFees = entry * size * lev * feeRate * 2; // Entry and exit fees
  const breakEvenMove = totalFees / (size * lev);

  return {
    breakEvenPrice: entry + breakEvenMove,
    totalFees,
    requiredMove: breakEvenMove,
    requiredMovePercentage: (breakEvenMove / entry) * 100,
  };
};

export const calculateCompoundInterest = (
  principal,
  monthlyContribution,
  annualInterestRate,
  years,
  compoundingFrequency = 12
) => {
  const P = parseFloat(principal);
  const PMT = parseFloat(monthlyContribution);
  const r = parseFloat(annualInterestRate) / 100;
  const t = parseFloat(years);
  const n = parseFloat(compoundingFrequency);

  if (!P || !r || !t || !n) {
    throw new Error('Invalid input parameters');
  }

  const i = r / n; // Interest rate per period
  const nt = n * t; // Total number of periods

  // Calculate future value with regular contributions
  const futureValue = P * Math.pow(1 + i, nt) +
    PMT * ((Math.pow(1 + i, nt) - 1) / i);

  const totalContributions = P + (PMT * nt);
  const totalInterest = futureValue - totalContributions;

  return {
    futureValue,
    totalContributions,
    totalInterest,
    annualInterestRate: r * 100,
    years: t,
  };
};

export const calculateMarginRequirement = (positionSize, entryPrice, leverage, maintenanceMargin = 0.5) => {
  const size = parseFloat(positionSize);
  const entry = parseFloat(entryPrice);
  const lev = parseFloat(leverage);
  const margin = parseFloat(maintenanceMargin) / 100;

  if (!size || !entry || !lev || !margin) {
    throw new Error('Invalid input parameters');
  }

  const positionValue = size * entry;
  const initialMargin = positionValue / lev;
  const maintenanceMarginAmount = positionValue * margin;

  return {
    positionValue,
    initialMargin,
    maintenanceMarginAmount,
    leverage: lev,
    effectivePosition: positionValue,
  };
};
