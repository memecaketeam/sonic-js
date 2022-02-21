import { Pair, SwapIDL, Token } from '@/declarations';

/**
 * Parses a list of supported tokens from swap canister request
 * @param response Response from swap canister
 * @returns Token.MetadataList
 */
export const parseSupportedTokenList = (
  response: SwapIDL.TokenInfoExt[]
): Token.MetadataList => {
  return response.reduce((parsed, item) => {
    return {
      ...parsed,
      [item.id]: item,
    };
  }, {});
};

/**
 * Parses a list of pairs from swap canister request
 * @param response Response from swap canister
 * @returns Pair.List
 */
export const parseAllPairs = (response: SwapIDL.PairInfoExt[]): Pair.List => {
  return response.reduce((list, pair) => {
    const { token0, token1, reserve0, reserve1 } = pair;

    if (Number(reserve0) === 0 && Number(reserve1) === 0) {
      return list;
    }

    return {
      ...list,
      [token0]: {
        ...list[token0],
        [token1]: pair,
      },
      [token1]: {
        ...list[token1],
        [token0]: {
          ...pair,
          token0: token1,
          token1: token0,
          reserve0: reserve1,
          reserve1: reserve0,
        },
      },
    };
  }, {} as Pair.List);
};

/**
 * Get deadline for swap canister requests
 * @returns bigint
 */
export const getDeadline = (): bigint => {
  return BigInt((new Date().getTime() + 5 * 60 * 1000) * 10000000);
};
