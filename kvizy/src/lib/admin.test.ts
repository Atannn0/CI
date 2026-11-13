import { describe, expect, it } from "vitest";
import { adminAccess } from "./admin";

const TOKEN = "s3cret-token-for-tests-0123456789";

function get(headers: Record<string, string> = {}) {
  return new Request("http://internal/api/admin/reports", { headers });
}

describe("adminAccess", () => {
  it("stays closed when the token is unset, empty or too short", () => {
    expect(adminAccess(get({ authorization: `Bearer ${TOKEN}` }), {})).toBe("closed");
    expect(adminAccess(get({ authorization: "Bearer " }), { KVIZY_ADMIN_TOKEN: "  " })).toBe("closed");
    expect(adminAccess(get({ authorization: "Bearer short" }), { KVIZY_ADMIN_TOKEN: "short" })).toBe("closed");
  });

  it("grants access only with the matching bearer token", () => {
    const env = { KVIZY_ADMIN_TOKEN: TOKEN };
    expect(adminAccess(get({ authorization: `Bearer ${TOKEN}` }), env)).toBe("granted");
    expect(adminAccess(get({ authorization: `bearer ${TOKEN}` }), env)).toBe("granted");
    expect(adminAccess(get({ authorization: `Bearer ${TOKEN}x` }), env)).toBe("denied");
    expect(adminAccess(get({ authorization: TOKEN }), env)).toBe("denied");
    expect(adminAccess(get(), env)).toBe("denied");
  });
});
