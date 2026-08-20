import {
  createApprovalToken,
  verifyApprovalToken,
} from "@/lib/approvalToken";

// Deterministic secret for tests.
process.env.ADMIN_APPROVAL_SECRET = "test-secret-0123456789abcdef0123456789abcdef";

describe("approvalToken", () => {
  it("accepts a valid token for the matching resource/id/action", () => {
    const token = createApprovalToken("withdrawal", 42, "approve");
    const result = verifyApprovalToken(token, {
      resource: "withdrawal",
      id: 42,
      action: "approve",
    });
    expect(result.valid).toBe(true);
  });

  it("rejects a token reused for a different id (no replay across records)", () => {
    const token = createApprovalToken("withdrawal", 42, "approve");
    const result = verifyApprovalToken(token, {
      resource: "withdrawal",
      id: 43,
      action: "approve",
    });
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("mismatch");
  });

  it("rejects a token reused for a different action (approve != reject)", () => {
    const token = createApprovalToken("deposit", 7, "approve");
    const result = verifyApprovalToken(token, {
      resource: "deposit",
      id: 7,
      action: "reject",
    });
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("mismatch");
  });

  it("rejects a tampered signature", () => {
    const token = createApprovalToken("withdrawal", 1, "approve");
    const tampered = token.slice(0, -2) + (token.endsWith("00") ? "11" : "00");
    const result = verifyApprovalToken(tampered, {
      resource: "withdrawal",
      id: 1,
      action: "approve",
    });
    expect(result.valid).toBe(false);
    expect(["bad_signature", "malformed"]).toContain(result.reason);
  });

  it("rejects an expired token", () => {
    const token = createApprovalToken("withdrawal", 5, "approve", -10); // already expired
    const result = verifyApprovalToken(token, {
      resource: "withdrawal",
      id: 5,
      action: "approve",
    });
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("expired");
  });

  it("rejects malformed input", () => {
    expect(verifyApprovalToken(null, { resource: "withdrawal", id: 1, action: "approve" }).valid).toBe(false);
    expect(verifyApprovalToken("garbage", { resource: "withdrawal", id: 1, action: "approve" }).valid).toBe(false);
  });
});
