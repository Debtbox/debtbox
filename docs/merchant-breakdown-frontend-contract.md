# Merchant Breakdown Frontend Contract

## What Changed

Merchant APIs now expose fee breakdowns in two places:

- `POST /v0.0.1/api/merchant/get-merchant-debts`
- `POST /v0.0.1/api/merchant/get-business-dashboard`

The merchant debt list now supports both single and grouped debt rows with the same top-level contract:

- single debt row: top-level row represents one debt
- grouped debt row: top-level row represents multiple debts
- top-level fee fields always represent the row total
- nested `debts` contains the individual debt details and each debt's own fee breakdown

No new frontend endpoint is required.

## Shared Fee Breakdown Shape

`expectedFeeBreakdown` is a display-ready SAR breakdown. `expected*Halala` fields are integer minor-unit values.

```json
{
  "currency": "SAR",
  "debtboxFees": 25,
  "paymentServiceFees": {
    "percentageFees": 37.5,
    "constantFees": 1,
    "vat": 5.78,
    "total": 44.28,
    "providerFeeType": "VISA_MASTER_UNKNOWN",
    "percentageBps": 250,
    "constantFee": 1,
    "cap": null
  },
  "instantPayoutFees": 0,
  "totalDeductions": 69.28,
  "expectedMerchantNetAmount": 1430.72
}
```

Frontend should not recalculate these values. Render them directly.

## Merchant Debts API

### Endpoint

`POST /v0.0.1/api/merchant/get-merchant-debts`

### Request

Unchanged.

```json
{
  "businessId": "1",
  "customerName": "",
  "debtDueStatus": ["normal"],
  "pageIndex": 0,
  "pageSize": 10,
  "isFullHistory": false
}
```

### Response Wrapper

```json
{
  "data": [],
  "count": 0
}
```

Each item in `data` is either a single debt row or a grouped debt row. See the examples below.

### Single Debt Row

For a single debt, the row still includes group metadata for consistency.

```json
{
  "debtId": 6,
  "customerId": 1,
  "full_name_ar": "حمد بن محمد بن حمد آل مهذل",
  "full_name_en": "HAMAD MOHAMMAD H ALMEHTHEL",
  "amount": 1500,
  "expectedDebtboxFeeHalala": 2500,
  "expectedInstantPayoutFeeHalala": 0,
  "expectedProviderFeeBaseHalala": 3850,
  "expectedProviderFeeVatHalala": 578,
  "expectedProviderFeeTotalHalala": 4428,
  "expectedProviderFeeType": "VISA_MASTER_UNKNOWN",
  "expectedTotalDeductionsHalala": 6928,
  "expectedMerchantNetAmountHalala": 143072,
  "expectedFeeBreakdown": {
    "currency": "SAR",
    "debtboxFees": 25,
    "paymentServiceFees": {
      "percentageFees": 37.5,
      "constantFees": 1,
      "vat": 5.78,
      "total": 44.28,
      "providerFeeType": "VISA_MASTER_UNKNOWN",
      "percentageBps": 250,
      "constantFee": 1,
      "cap": null
    },
    "instantPayoutFees": 0,
    "totalDeductions": 69.28,
    "expectedMerchantNetAmount": 1430.72
  },
  "title": "لابتوب جديد",
  "due_date": "2026-05-30T21:00:00.000Z",
  "oldDueDate": "2026-05-30T21:00:00.000Z",
  "status": "active",
  "dueDateStatus": "normal",
  "extensionRequestStatus": null,
  "isPending": false,
  "isOverdue": false,
  "reason": null,
  "newDueDate": null,
  "createWithSanad": true,
  "paymentDate": null,
  "paymentMethod": null,
  "groupId": "601f76d8-481b-4cbe-aa83-7649e6d84df5",
  "isGrouped": false,
  "debtIds": [6],
  "debtsCount": 1,
  "groupAmount": 1500,
  "groupStatus": "active",
  "debts": [
    {
      "debtId": 6,
      "amount": 1500,
      "expectedFeeBreakdown": {
        "currency": "SAR",
        "debtboxFees": 25,
        "paymentServiceFees": {
          "percentageFees": 37.5,
          "constantFees": 1,
          "vat": 5.78,
          "total": 44.28,
          "providerFeeType": "VISA_MASTER_UNKNOWN",
          "percentageBps": 250,
          "constantFee": 1,
          "cap": null
        },
        "instantPayoutFees": 0,
        "totalDeductions": 69.28,
        "expectedMerchantNetAmount": 1430.72
      }
    }
  ]
}
```

### Grouped Debt Row

For grouped rows, the top-level values are aggregated across the nested debts.

```json
{
  "debtId": 6,
  "customerId": 1,
  "full_name_ar": "حمد بن محمد بن حمد آل مهذل",
  "full_name_en": "HAMAD MOHAMMAD H ALMEHTHEL",
  "amount": 3100,
  "expectedDebtboxFeeHalala": 5000,
  "expectedInstantPayoutFeeHalala": 0,
  "expectedProviderFeeBaseHalala": 7600,
  "expectedProviderFeeVatHalala": 1140,
  "expectedProviderFeeTotalHalala": 9143,
  "expectedProviderFeeType": "VISA_MASTER_UNKNOWN",
  "expectedTotalDeductionsHalala": 14143,
  "expectedMerchantNetAmountHalala": 295857,
  "expectedFeeBreakdown": {
    "currency": "SAR",
    "debtboxFees": 50,
    "paymentServiceFees": {
      "percentageFees": 78.5,
      "constantFees": 1,
      "vat": 11.93,
      "total": 91.43,
      "providerFeeType": "VISA_MASTER_UNKNOWN",
      "percentageBps": 250,
      "constantFee": 1,
      "cap": null
    },
    "instantPayoutFees": 0,
    "totalDeductions": 141.43,
    "expectedMerchantNetAmount": 2958.57
  },
  "title": "لابتوب جديد",
  "due_date": "2026-05-30T21:00:00.000Z",
  "oldDueDate": "2026-05-30T21:00:00.000Z",
  "status": "active",
  "dueDateStatus": "normal",
  "extensionRequestStatus": null,
  "isPending": false,
  "isOverdue": false,
  "reason": null,
  "newDueDate": null,
  "createWithSanad": true,
  "paymentDate": null,
  "paymentMethod": null,
  "groupId": "601f76d8-481b-4cbe-aa83-7649e6d84df5",
  "isGrouped": true,
  "debtIds": [6, 10],
  "debtsCount": 2,
  "groupAmount": 3100,
  "groupStatus": "active",
  "debts": [
    {
      "debtId": 6,
      "amount": 1500,
      "expectedDebtboxFeeHalala": 2500,
      "expectedProviderFeeTotalHalala": 4428,
      "expectedTotalDeductionsHalala": 6928,
      "expectedMerchantNetAmountHalala": 143072,
      "expectedFeeBreakdown": {
        "currency": "SAR",
        "debtboxFees": 25,
        "paymentServiceFees": {
          "percentageFees": 37.5,
          "constantFees": 1,
          "vat": 5.78,
          "total": 44.28,
          "providerFeeType": "VISA_MASTER_UNKNOWN",
          "percentageBps": 250,
          "constantFee": 1,
          "cap": null
        },
        "instantPayoutFees": 0,
        "totalDeductions": 69.28,
        "expectedMerchantNetAmount": 1430.72
      }
    },
    {
      "debtId": 10,
      "amount": 1600,
      "expectedDebtboxFeeHalala": 2500,
      "expectedProviderFeeTotalHalala": 4715,
      "expectedTotalDeductionsHalala": 7215,
      "expectedMerchantNetAmountHalala": 152785,
      "expectedFeeBreakdown": {
        "currency": "SAR",
        "debtboxFees": 25,
        "paymentServiceFees": {
          "percentageFees": 41,
          "constantFees": 0,
          "vat": 6.15,
          "total": 47.15,
          "providerFeeType": "VISA_MASTER_UNKNOWN",
          "percentageBps": 250,
          "constantFee": 1,
          "cap": null
        },
        "instantPayoutFees": 0,
        "totalDeductions": 72.15,
        "expectedMerchantNetAmount": 1527.85
      }
    }
  ]
}
```

## Merchant Dashboard API

### Endpoint

`POST /v0.0.1/api/merchant/get-business-dashboard`

### Request

Unchanged.

```json
{
  "businessId": "1"
}
```

`businessId` can be omitted/null depending on the current existing dashboard filter behavior.

### Response

The dashboard now includes `expectedFeeBreakdown` for the current open debt total.

```json
{
  "total": 3100,
  "totalDebtAmount": 3100,
  "totalDebtAmountHalala": 310000,
  "totalCollectedAmount": 1250,
  "totalCollectedAmountHalala": 125000,
  "successfulPaymentsCount": 4,
  "activeDebtsCount": 2,
  "overdueDebtsCount": 0,
  "inArrearsDebtsCount": 0,
  "pendingDebtsCount": 1,
  "expectedFeeBreakdown": {
    "currency": "SAR",
    "debtboxFees": 50,
    "paymentServiceFees": {
      "percentageFees": 78.5,
      "constantFees": 1,
      "vat": 11.93,
      "total": 91.43,
      "providerFeeType": "VISA_MASTER_UNKNOWN",
      "percentageBps": 250,
      "constantFee": 1,
      "cap": null
    },
    "instantPayoutFees": 0,
    "totalDeductions": 141.43,
    "expectedMerchantNetAmount": 2958.57
  }
}
```

## Frontend Update Checklist

### Merchant Debt List

- Use top-level `amount` / `groupAmount` for row total.
- Use top-level `expectedFeeBreakdown` for row total fees.
- If `isGrouped === true`, show `debtsCount` and optionally render expandable individual debt details from `debts`.
- For expanded grouped rows, render each child debt using `debt.expectedFeeBreakdown`.
- For single rows, continue rendering top-level fields. `debts` can be ignored unless the UI uses one shared expandable component.
- Continue sending only the top-level `debtId` to action APIs.
- Do not call actions for every `debtIds` item.

### Merchant Dashboard

- Show `expectedFeeBreakdown` as the dashboard/open-debt expected fee summary.
- Use `totalDebtAmount` or `total` as the displayed open debt total.
- Use `totalDebtAmountHalala` when minor-unit precision is needed.
- Do not sum list rows on the frontend to build dashboard fees; use the dashboard response.

## Important Notes

- `expectedFeeBreakdown` values are SAR display values.
- `expected*Halala` values are integer halala values.
- Top-level grouped-row fee fields are aggregated.
- Nested `debts[*]` fee fields are per-debt.
- `expectedProviderFeeType` on an aggregated row is the representative provider fee type for display. The nested debt rows are the source of truth for each individual debt.
