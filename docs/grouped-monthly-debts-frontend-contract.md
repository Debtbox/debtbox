# Grouped Monthly Debts Frontend Contract

## Summary

Debts are now automatically grouped when they share the same:

- `customer_id`
- `merchant_id`
- `business_id`
- calendar `due_date`

The existing public APIs are still used. No new frontend endpoints are required. A `debtId` remains the backward-compatible anchor id, but eligible actions now resolve that debt's group and apply to all debts in the group.

Single debts also belong to a group of one, so old screens can continue to work while newer screens can use the optional group metadata.

## Backend Changes

- Added `debt_groups`.
- Added nullable `debts.group_id`.
- Added nullable `payments.group_id`.
- Added `payment_debt_allocations` to map one grouped payment to every debt it settles.
- `addDebt` now finds or creates a matching group automatically.
- Read APIs collapse multiple debts in the same group into one debt row.
- Existing action APIs still accept `debtId`, but group-aware actions apply to the whole group:
  - online pay
  - mark cash paid
  - confirm/reject cash payment
  - extend due date
  - mark overdue
  - mark not overdue
  - cancel pending debt
  - consent reattempt

## New Optional Response Fields

Debt list rows can now include:

```json
{
  "groupId": "c43c3f9f-8b4b-4a72-9cc4-1d85df7b0911",
  "isGrouped": true,
  "debtIds": [101, 102, 103],
  "debtsCount": 3,
  "groupAmount": 750,
  "groupStatus": "normal",
  "expectedFeeBreakdown": {
    "currency": "SAR",
    "debtboxFees": 50,
    "paymentServiceFees": {
      "percentageFees": 18.75,
      "constantFees": 1,
      "vat": 2.96,
      "total": 22.71,
      "providerFeeType": "VISA_MASTER_UNKNOWN",
      "percentageBps": 250,
      "constantFee": 1,
      "cap": null
    },
    "instantPayoutFees": 0,
    "totalDeductions": 72.71,
    "expectedMerchantNetAmount": 677.29
  },
  "debts": [
    {
      "debtId": 101,
      "amount": 250,
      "expectedFeeBreakdown": {
        "currency": "SAR",
        "debtboxFees": 50,
        "paymentServiceFees": {
          "percentageFees": 6.25,
          "constantFees": 1,
          "vat": 1.09,
          "total": 8.34,
          "providerFeeType": "VISA_MASTER_UNKNOWN",
          "percentageBps": 250,
          "constantFee": 1,
          "cap": null
        },
        "instantPayoutFees": 0,
        "totalDeductions": 58.34,
        "expectedMerchantNetAmount": 191.66
      }
    }
  ]
}
```

Field meanings:

- `debtId`: anchor debt id. Keep using this for current action APIs.
- `groupId`: persisted group id. Nullable for legacy rows before migration or safety fallback.
- `isGrouped`: `true` when this row represents more than one debt.
- `debtIds`: all debt ids represented by this row.
- `debtsCount`: number of debts in the row.
- `groupAmount`: total amount for all debts in the row.
- `groupStatus`: shared status when all represented debts match, otherwise `mixed`.
- `expectedFeeBreakdown`: aggregated fee breakdown for the whole row/group.
- `debts`: individual debts represented by the row. Each item keeps its own amount, status, dates, fee halala fields, and `expectedFeeBreakdown`.

## Customer Debt List

### Before

Multiple purchases from the same business appeared as separate rows:

```json
{
  "data": [
    {
      "debtId": 101,
      "amount": 250,
      "title": "Groceries",
      "due_date": "2026-05-31",
      "status": "normal"
    },
    {
      "debtId": 102,
      "amount": 500,
      "title": "Groceries",
      "due_date": "2026-05-31",
      "status": "normal"
    }
  ],
  "count": 2
}
```

### After

The same debts are exposed as one actionable row:

```json
{
  "data": [
    {
      "debtId": 101,
      "amount": 750,
      "title": "Groceries",
      "due_date": "2026-05-31",
      "status": "normal",
      "groupId": "c43c3f9f-8b4b-4a72-9cc4-1d85df7b0911",
      "isGrouped": true,
      "debtIds": [101, 102],
      "debtsCount": 2,
      "groupAmount": 750,
      "groupStatus": "normal",
      "expectedFeeBreakdown": {
        "currency": "SAR",
        "debtboxFees": 100,
        "paymentServiceFees": {
          "percentageFees": 18.75,
          "constantFees": 2,
          "vat": 3.11,
          "total": 23.86,
          "providerFeeType": "VISA_MASTER_UNKNOWN",
          "percentageBps": 250,
          "constantFee": 1,
          "cap": null
        },
        "instantPayoutFees": 0,
        "totalDeductions": 123.86,
        "expectedMerchantNetAmount": 626.14
      },
      "debts": [
        {
          "debtId": 101,
          "amount": 250,
          "title": "Groceries",
          "due_date": "2026-05-31",
          "status": "normal",
          "expectedFeeBreakdown": {
            "currency": "SAR",
            "debtboxFees": 50,
            "paymentServiceFees": {
              "percentageFees": 6.25,
              "constantFees": 1,
              "vat": 1.09,
              "total": 8.34,
              "providerFeeType": "VISA_MASTER_UNKNOWN",
              "percentageBps": 250,
              "constantFee": 1,
              "cap": null
            },
            "instantPayoutFees": 0,
            "totalDeductions": 58.34,
            "expectedMerchantNetAmount": 191.66
          }
        },
        {
          "debtId": 102,
          "amount": 500,
          "title": "Groceries",
          "due_date": "2026-05-31",
          "status": "normal",
          "expectedFeeBreakdown": {
            "currency": "SAR",
            "debtboxFees": 50,
            "paymentServiceFees": {
              "percentageFees": 12.5,
              "constantFees": 1,
              "vat": 2.02,
              "total": 15.52,
              "providerFeeType": "VISA_MASTER_UNKNOWN",
              "percentageBps": 250,
              "constantFee": 1,
              "cap": null
            },
            "instantPayoutFees": 0,
            "totalDeductions": 65.52,
            "expectedMerchantNetAmount": 434.48
          }
        }
      ]
    }
  ],
  "count": 1
}
```

For the grouped-by-business customer response, each business still has a `debts` array. The items inside that array may now represent a single debt or a grouped debt.

## Merchant Debt List

### Before

```json
{
  "data": [
    {
      "debtId": 101,
      "customerId": 55,
      "full_name_en": "Customer Name",
      "amount": 250,
      "due_date": "2026-05-31",
      "status": "active",
      "expectedMerchantNetAmountHalala": 24000
    },
    {
      "debtId": 102,
      "customerId": 55,
      "full_name_en": "Customer Name",
      "amount": 500,
      "due_date": "2026-05-31",
      "status": "active",
      "expectedMerchantNetAmountHalala": 48000
    }
  ],
  "count": 2
}
```

### After

```json
{
  "data": [
    {
      "debtId": 101,
      "customerId": 55,
      "full_name_en": "Customer Name",
      "amount": 750,
      "due_date": "2026-05-31",
      "status": "active",
      "expectedMerchantNetAmountHalala": 72000,
      "groupId": "c43c3f9f-8b4b-4a72-9cc4-1d85df7b0911",
      "isGrouped": true,
      "debtIds": [101, 102],
      "debtsCount": 2,
      "groupAmount": 750,
      "groupStatus": "active",
      "expectedFeeBreakdown": {
        "currency": "SAR",
        "debtboxFees": 100,
        "paymentServiceFees": {
          "percentageFees": 18.75,
          "constantFees": 2,
          "vat": 3.11,
          "total": 23.86,
          "providerFeeType": "VISA_MASTER_UNKNOWN",
          "percentageBps": 250,
          "constantFee": 1,
          "cap": null
        },
        "instantPayoutFees": 0,
        "totalDeductions": 123.86,
        "expectedMerchantNetAmount": 626.14
      },
      "debts": [
        {
          "debtId": 101,
          "amount": 250,
          "due_date": "2026-05-31",
          "status": "active",
          "expectedMerchantNetAmountHalala": 19166,
          "expectedFeeBreakdown": {
            "currency": "SAR",
            "debtboxFees": 50,
            "paymentServiceFees": {
              "percentageFees": 6.25,
              "constantFees": 1,
              "vat": 1.09,
              "total": 8.34,
              "providerFeeType": "VISA_MASTER_UNKNOWN",
              "percentageBps": 250,
              "constantFee": 1,
              "cap": null
            },
            "instantPayoutFees": 0,
            "totalDeductions": 58.34,
            "expectedMerchantNetAmount": 191.66
          }
        },
        {
          "debtId": 102,
          "amount": 500,
          "due_date": "2026-05-31",
          "status": "active",
          "expectedMerchantNetAmountHalala": 43448,
          "expectedFeeBreakdown": {
            "currency": "SAR",
            "debtboxFees": 50,
            "paymentServiceFees": {
              "percentageFees": 12.5,
              "constantFees": 1,
              "vat": 2.02,
              "total": 15.52,
              "providerFeeType": "VISA_MASTER_UNKNOWN",
              "percentageBps": 250,
              "constantFee": 1,
              "cap": null
            },
            "instantPayoutFees": 0,
            "totalDeductions": 65.52,
            "expectedMerchantNetAmount": 434.48
          }
        }
      ]
    }
  ],
  "count": 1
}
```

Fee fields are aggregated for the grouped row. The nested `debts` array keeps the per-debt fee fields and per-debt `expectedFeeBreakdown`.

## Action Behavior

The frontend should continue sending the row's `debtId` to existing endpoints.

Example:

```json
{
  "debtId": 101
}
```

If `debtId: 101` belongs to a group with debts `[101, 102]`, the backend applies the action to the group where supported.

Important behavior:

- Online payment creates one checkout for the total unpaid actionable group amount.
- Successful online payment marks every allocated debt as paid.
- Cash confirmation creates one parent cash payment and per-debt allocation rows.
- Due-date extension creates extension records for every debt in the group and updates the group due date.
- Overdue/not-overdue actions validate every debt first; if any debt is not eligible, the whole action fails.
- Mixed-status groups are rejected for unsafe actions using existing error patterns.

## Frontend Updates Required

1. Treat a debt row as the actionable element, not necessarily a single DB debt.

Use `debtId` as the action anchor. Display grouping with `isGrouped`, `debtsCount`, and `groupAmount`.

2. Show totals from the row.

For grouped rows, `amount` and `groupAmount` are already the total. Prefer:

```ts
const displayAmount = debt.groupAmount ?? debt.amount;
```

3. Display grouped indicator.

Example labels:

- Single debt: existing UI unchanged.
- Grouped debt: `3 debts` or `3 purchases`.

4. Do not loop and call actions for every `debtIds` item.

Call the existing endpoint once with the anchor `debtId`. The backend performs the grouped action.

5. Payment screen should use the row total.

Checkout amount should come from `groupAmount ?? amount`.

6. Details screen should be tolerant of grouped rows.

If a details screen only accepts one `debtId`, keep opening the anchor debt for now. If the UI wants to show the debts inside the group, use `debtIds` from the list response or add a dedicated details enhancement later.

7. Status rendering must handle `mixed`.

If `groupStatus === "mixed"`, show a neutral grouped status or disable unsafe actions based on the action error returned by the backend.

8. Count display should use API `count`.

The list `count` now reflects grouped rows in the returned response for updated list endpoints.

## Backward Compatibility

Older frontend behavior still works because:

- `debtId` remains present.
- Existing endpoints are unchanged.
- Single-debt rows still look like normal debt rows.
- New fields are optional and can be ignored by older clients.

The main frontend risk is accidentally calling an action once per `debtIds` item. Do not do that; call once using the row's `debtId`.
