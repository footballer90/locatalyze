<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into Locatalyze. The integration covers both client-side and server-side event tracking across the full user journey — from signup through analysis submission, checkout, and payment confirmation.

**Key files created:**
- `instrumentation-client.ts` — Initialises PostHog on the client using the Next.js 15.3+ instrumentation API with a reverse proxy, exception capture, and debug mode in development.
- `lib/posthog-server.ts` — Singleton PostHog Node.js client for server-side event capture in API routes.

**next.config.ts** was updated with PostHog reverse proxy rewrites (`/ingest/*`) and `skipTrailingSlashRedirect: true` to ensure reliable event ingestion through the proxy.

**.env.local** was updated with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account | `app/auth/signup/page.tsx` |
| `user_logged_in` | User successfully signed in | `app/auth/login/page.tsx` |
| `analysis_started` | User submitted the onboarding form to start a location analysis | `app/onboarding/page.tsx` |
| `checkout_initiated` | User clicked a checkout button on the upgrade page | `app/(app)/upgrade/page.tsx` |
| `payment_completed` | Stripe webhook confirmed a successful payment | `app/api/stripe/webhook/route.ts` |
| `report_generated` | A new location report was successfully created | `app/api/reports/route.ts` |

Users are identified via `posthog.identify()` with their Supabase user ID on both signup and login.

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics:** https://us.posthog.com/project/381472/dashboard/1465069
- **Conversion funnel (Signup → Analysis → Checkout → Payment):** https://us.posthog.com/project/381472/insights/kVljmcu4
- **New signups over time:** https://us.posthog.com/project/381472/insights/AT1emgO2
- **Analysis submissions by business type:** https://us.posthog.com/project/381472/insights/FXxtHq7k
- **Payments completed over time:** https://us.posthog.com/project/381472/insights/VHsQmRUK
- **Checkout plan breakdown:** https://us.posthog.com/project/381472/insights/LJDz4zQs

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
