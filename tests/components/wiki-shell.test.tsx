/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useWikiShell, WikiShellProvider } from "@/components/wiki-shell-context";

afterEach(() => {
  cleanup();
});

function Probe() {
  const shell = useWikiShell();

  return (
    <div>
      <button onClick={() => shell.openPanel({ scope: "global" })}>Open panel</button>
      <button onClick={shell.closePanel}>Close panel</button>
      <span>{shell.isPanelOpen ? "panel-open" : "panel-closed"}</span>
    </div>
  );
}

describe("WikiShellProvider", () => {
  it("opens and closes the ask ai panel state", () => {
    render(
      <WikiShellProvider>
        <Probe />
      </WikiShellProvider>,
    );

    expect(screen.getByText("panel-closed")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Open panel" }));
    expect(screen.getByText("panel-open")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close panel" }));
    expect(screen.getByText("panel-closed")).toBeInTheDocument();
  });
});
