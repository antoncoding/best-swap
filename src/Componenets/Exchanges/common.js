export const amountCheck = (fix, amount, limit) => {
  if (!limit) return
  if (limit.error) throw limit.error;
  if (fix) {
    if (limit.fixError) throw limit.fixError
    if (amount < limit.minAmountFixed) throw Error(`Min Amount: ${limit.minAmountFixed}`)
    else if (amount > limit.maxAmountFixed) throw Error(`Max Amount: ${limit.maxAmountFixed}`)
  } else {
    if (limit.floatError) throw limit.floatError
    if (amount < limit.minAmountFloat) throw Error(`Min Amount: ${limit.minAmountFloat}`)
    else if (amount > limit.maxAmountFloat) throw Error(`Max Amount ${limit.maxAmountFloat}`)
  }
}
