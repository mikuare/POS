# Sales Avg PHP Explanation

This document explains how the system currently computes the `Avg PHP` value shown in the detailed sales output.

## Current Meaning of Avg PHP

`Avg PHP` is currently treated as the **average ticket per transaction**.

Formula:

```text
Avg PHP = Total Sales / Total Transactions
```

It is **not** currently computed as:

- total sales divided by number of calendar days
- total sales divided by number of operating days
- projected average for the full month

## Where the Computation Happens

The main sales summary logic is in:

- `src/data/store.js`

Current logic:

```js
const totalTransactions = rows.length;
const averageTicket = totalTransactions ? totalSales / totalTransactions : 0;
```

So:

- `totalSales` = sum of all paid sales in the selected range
- `totalTransactions` = number of paid transactions in that range
- `averageTicket` = `totalSales / totalTransactions`

## Daily Avg PHP

For the detailed daily sales card:

- the server gets all paid transactions from the start of the current day to the end of the current day
- then it computes:

```text
Daily Avg PHP = Daily Total Sales / Daily Total Transactions
```

Example:

- Daily total sales = `PHP 12,000`
- Daily transactions = `30`
- Daily Avg PHP = `PHP 400`

## Monthly Avg PHP

For the detailed monthly sales card:

- the server gets all paid transactions from the first day of the current month to the last day of the current month
- then it computes:

```text
Monthly Avg PHP = Monthly Total Sales / Monthly Total Transactions
```

Example:

- Monthly total sales = `PHP 180,000`
- Monthly transactions = `450`
- Monthly Avg PHP = `PHP 400`

## Important Note

This means the monthly `Avg PHP` is an **average sale per transaction for the month**, not an **average revenue per day**.

If you want a different metric, these are separate meanings:

- `Average per transaction` = `totalSales / totalTransactions`
- `Average per day` = `totalSales / numberOfDays`
- `Average per operating day` = `totalSales / daysWithSales`

## UI Behavior

The frontend shows the value as:

- Daily: `transactions | Avg PHP xxx.xx`
- Monthly: `transactions | Avg PHP xxx.xx`

So the displayed `Avg PHP` is the backend `averageTicket` value for that date range.

## Summary

Current behavior:

- Daily `Avg PHP` = average amount per transaction for today
- Monthly `Avg PHP` = average amount per transaction for the current month

If needed later, the system can be changed to show both:

- `Avg per Transaction`
- `Avg per Day`
