import { describe, expect, it } from "vitest";
import { detectSourceKind } from "@/lib/ingest/extract-text";

describe("detectSourceKind", () => {
  it("detects assignment-like docs from filenames", () => {
    expect(
      detectSourceKind(
        "week3-assignment.docx",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ),
    ).toBe("assignment");
  });
});
