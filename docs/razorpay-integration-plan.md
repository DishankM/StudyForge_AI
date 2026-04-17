# Razorpay Integration Plan

This project is now prepared for plan-aware UI and usage limits. The next billing step is wiring live payments for `STUDENT_PRO`.

## Environment

Add these variables:

- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `RAZORPAY_PRO_PLAN_ID`

## Recommended flow

1. Create the monthly Student Pro subscription plan in Razorpay Dashboard.
2. Add a server route that creates a Razorpay subscription for the signed-in user.
3. Open Razorpay Standard Checkout from the billing page with the returned subscription id.
4. Add a webhook endpoint to verify Razorpay signatures.
5. Update `user.plan` to `STUDENT_PRO` only after a successful subscription or payment event.
6. Store subscription metadata in billing tables for renewals, invoices, and failed payment recovery.

## Data model to add

Suggested tables:

- `BillingCustomer`
- `BillingSubscription`
- `BillingInvoice`
- `BillingEventLog`

Important fields:

- internal user id
- razorpay customer id
- razorpay subscription id
- razorpay payment id
- status
- current period start/end
- next billing date
- last webhook event id

## Webhooks to handle

At minimum:

- subscription activated
- subscription charged
- subscription paused
- subscription cancelled
- payment failed

## Product behavior

- Free users stay on monthly quotas.
- Successful Student Pro payments unlock higher monthly quotas.
- Institute remains a sales-assisted flow instead of self-serve checkout.

## Official references

- Razorpay Standard Checkout: https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/
- Razorpay Subscriptions overview: https://razorpay.com/docs/payments/subscriptions/?locale=en-US
