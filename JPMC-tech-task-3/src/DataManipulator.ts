import { ServerRespond } from './DataStreamer';

export interface Row {
  // Updated the row interface to match the updated schema in Graph.tsx
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}


export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2; 
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2; 
    const ratio = priceABC / priceDEF;
    // Set upper and lower bound for trigger alert to be +/- 6% of the 
    // 12 month historical average ratio
    const upperBound = 1 + 0.06;
    const lowerBound = 1 - 0.06;
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ?
        serverRespond[0].timestamp : serverRespond[1].timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert: (ratio < lowerBound || ratio > upperBound) ? ratio : undefined,
    }
  }
}
