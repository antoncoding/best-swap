export const amountCheck = (fix, amount, limit) => {
  if (fix) {
    if (amount < limit.minAmountFixed) throw Error(`Min Amount: ${limit.minAmountFixed}`)
    else if (amount > limit.maxAmountFixed) throw Error(`Max Amount: ${limit.maxAmountFixed}`)
  } else {
    if (amount < limit.minAmountFloat) throw Error(`Min Amount: ${limit.minAmountFloat}`)
    else if (amount > limit.maxAmountFloat) throw Error(`Max Amount ${limit.maxAmountFloat}`)
  }
}
