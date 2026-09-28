/**
 * Netlify Forms helpers for Salary Secure (V1).
 *
 * Submissions use application/x-www-form-urlencoded — never JSON.
 * Private API credentials are not required for this path.
 */

export const NETLIFY_FORM_WAITLIST = "salary-secure-waitlist";
export const NETLIFY_FORM_CONTACT = "salary-secure-contact";

/**
 * AJAX post target for Netlify Forms.
 *
 * With Next.js on Netlify, POST /__forms.html often 404s (Next handles the
 * route). Netlify docs: POST to "/" with form-name; edge intercepts Forms.
 * Static blueprints in public/__forms.html remain for build-time detection.
 */
export const NETLIFY_FORMS_ENDPOINT = "/";

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

    // Netlify Forms returns 200 when accepted. Some Next.js setups may still
    // return HTML for "/" — treat 2xx as success if form detection is enabled.
    if (!res.ok) {
      return { ok: false, error: "Something went wrong. Please try again." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}
