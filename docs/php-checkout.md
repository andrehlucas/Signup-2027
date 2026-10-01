# PHP checkout preparation

The backend can prepare a signup for a future external PHP checkout using
`POST /api/checkout`. Configure the destination with the server environment
variable `PHP_CHECKOUT_URL`. It must be an absolute HTTPS URL without embedded
credentials. When it is missing or invalid, the endpoint returns `503` and does
not create a signup record.

## Request

Send the same JSON payload accepted by the existing `POST /api/signup`
endpoint. It includes a UUID `requestId`, `userInfo`, `locationId`, `programId`,
and `billing`. The existing signup validation and idempotency rules apply.

## Responses

A valid request and configured destination returns `201`:

```json
{
  "status": "checkout_ready",
  "checkoutUrl": "https://checkout.example.com/start",
  "signupId": "saved-signup-id"
}
```

Validation and request-ID conflict errors are passed through from the existing
signup flow. An unavailable destination returns `503`:

```json
{
  "message": "Checkout is not connected yet. Please try again later."
}
```

The returned URL is the configured URL unchanged; the backend does not append
query parameters or put customer information in it. This only prepares and
saves a signup and provides a redirect destination. URL configuration alone
does not transfer signup data to PHP: PHP field mapping and data transfer are
intentionally deferred until the actual PHP checkout contract is available.
No charge or account/service activation occurs here.

Signup records currently use the application's in-memory storage, so they are
not durable across server restarts. Persistent checkout handoff will require
durable storage and the agreed PHP integration contract.