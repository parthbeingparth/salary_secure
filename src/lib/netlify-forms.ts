/**
 * Netlify Forms helpers for Salary Secure (V1).
 *
 * Submissions use application/x-www-form-urlencoded — never JSON.
 * Private API credentials are not required for this path.
 */

export const NETLIFY_FORM_WAITLIST = "salary-secure-waitlist";
export const NETLIFY_FORM_CONTACT = "salary-secure-contact";

/** Static HTML blueprint Netlify crawls + AJAX post target */
export const NETLIFY_FORMS_ENDPOINT = "/__forms.html";

export type NetlifyFormPayload = Record<
  string,
  string | number | boolean | null | undefined
>;

function encodePayload(
  formName: string,
  fields: NetlifyFormPayload,
): string {
  const params = new URLSearchParams();
  params.set("form-name", formName);
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null) continue;
    params.set(key, String(value));
  }
  return params.toString();
}

/**
 * AJAX submit to Netlify Forms.
 * Returns ok:false for network / non-2xx without exposing server internals.
 */
export async function submitNetlifyForm(
  formName: string,
  fields: NetlifyFormPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  // Never allow a filled honeypot through.
  if (fields["bot-field"]) {
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  try {
    const body = encodePayload(formName, fields);
    const res = await fetch(NETLIFY_FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    if (!res.ok) {
      return { ok: false, error: "Something went wrong. Please try again." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}
