import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.join(__dirname, "..", "public", "demo", "frames");

async function resetOutputDir() {
  await fs.mkdir(outputDir, { recursive: true });
  const entries = await fs.readdir(outputDir, { withFileTypes: true });
  await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".png"))
      .map((entry) => fs.unlink(path.join(outputDir, entry.name))),
  );
}

async function injectDemoAnswer(page) {
  await page.evaluate(() => {
    const textarea = document.querySelector("textarea");
    if (!(textarea instanceof HTMLTextAreaElement)) {
      throw new Error("Chat textarea not found");
    }

    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value",
    )?.set;
    setter?.call(textarea, "배열 접근 패턴이 왜 성능 차이를 만들었나요?");
    textarea.dispatchEvent(new Event("input", { bubbles: true }));

    const section = textarea.closest("section");
    if (!(section instanceof HTMLElement)) {
      throw new Error("Chat section not found");
    }

    section.querySelector("[data-demo-answer]")?.remove();

    const wrapper = document.createElement("div");
    wrapper.setAttribute("data-demo-answer", "true");
    wrapper.innerHTML = `
      <p class="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">
        순차 접근은 인접한 메모리 주소를 연속적으로 읽기 때문에 spatial locality가 높습니다.
        그래서 cache block에 함께 올라온 nearby data를 다시 활용할 수 있고, cache miss가 줄어들어 실행 시간이 짧아집니다.
      </p>
      <ul class="mt-4 space-y-1 text-xs text-slate-500">
        <li>Source: 지역성</li>
        <li>Source: 배열 접근 패턴과 성능</li>
      </ul>
    `;
    section.append(wrapper);
  });
}

async function capture() {
  await resetOutputDir();

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1024 },
    deviceScaleFactor: 2,
  });

  await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
  await page.locator("text=A study wiki that reads like a knowledge base.").waitFor();

  await page.screenshot({
    path: path.join(outputDir, "01-upload.png"),
    fullPage: false,
  });

  await page.getByRole("heading", { name: "Knowledge base", exact: true }).waitFor();
  await page.evaluate(() => window.scrollTo({ top: 720, behavior: "instant" }));
  await page.screenshot({
    path: path.join(outputDir, "02-wiki-list.png"),
    fullPage: false,
  });

  await page.goto("http://127.0.0.1:3000/wiki/cache-memory", {
    waitUntil: "networkidle",
  });
  await page.getByRole("heading", { name: "Linked concepts" }).waitFor();
  await page.screenshot({
    path: path.join(outputDir, "03-related-pages.png"),
    fullPage: false,
  });

  await page.getByRole("button", { name: "Open Ask AI" }).first().click();
  await page.getByRole("heading", { name: "Wiki AI Chat" }).first().waitFor();
  await injectDemoAnswer(page);
  await page.screenshot({
    path: path.join(outputDir, "04-chat.png"),
    fullPage: false,
  });

  await browser.close();
}

capture().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
