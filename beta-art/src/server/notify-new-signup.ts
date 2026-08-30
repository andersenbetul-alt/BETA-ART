type NewSignup = {
  userId: string;
  email?: string | null;
  createdAt?: string | null;
};

/**
 * Sends a server-side notification to Slack when a real account is created.
 *
 * Required production secret:
 *   SLACK_NEW_SIGNUPS_WEBHOOK_URL
 *
 * Call this from the server-side auth/signup success path only.
 * Never expose the webhook URL to client-side code.
 */
export async function notifyNewSignup(signup: NewSignup) {
  const webhookUrl = process.env.SLACK_NEW_SIGNUPS_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("SLACK_NEW_SIGNUPS_WEBHOOK_URL is not configured; signup notification skipped.");
    return;
  }

  const createdAt = signup.createdAt ?? new Date().toISOString();
  const identity = signup.email?.trim() || signup.userId;

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: [
        "New Beta Art account created",
        `User: ${identity}`,
        `User ID: ${signup.userId}`,
        `Created: ${createdAt}`,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    throw new Error(`Slack signup notification failed with status ${response.status}`);
  }
}
