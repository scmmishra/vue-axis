export default function useNiceNumbers(min, max, ticks = 10) {
  if (min === max) {
    return Array.from({ length: ticks }, (_, index) => index + 1);
  }

  function getNiceNumber(candidate, round) {
    const exponent = Math.floor(Math.log10(candidate));
    const fraction = candidate / Math.pow(10, exponent);
    let niceFraction;

    if (round) {
      if (fraction < 1.5) niceFraction = 1;
      else if (fraction < 3) niceFraction = 2;
      else if (fraction < 7) niceFraction = 5;
      else niceFraction = 10;
    } else {
      if (fraction <= 1) niceFraction = 1;
      else if (fraction <= 2) niceFraction = 2;
      else if (fraction <= 5) niceFraction = 5;
      else niceFraction = 10;
    }

    return niceFraction * Math.pow(10, exponent);
  }

  function roundTo(num, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
  }

  const range = getNiceNumber(max - min, false);
  const tickSpacing = getNiceNumber(range / (ticks - 1), true);
  const graphMin = Math.floor(min / tickSpacing) * tickSpacing;
  const graphMax = Math.ceil(max / tickSpacing) * tickSpacing;

  // number of decimal digits to show
  const decimals = Math.max(-Math.floor(Math.log10(tickSpacing)), 0);

  const niceNumbers = [];
  for (
    let step = graphMin;
    step <= graphMax + tickSpacing / 2;
    step += tickSpacing
  ) {
    niceNumbers.push(roundTo(step, decimals));
  }

  return niceNumbers;
}
