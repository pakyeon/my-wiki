# Demo Dataset: Cache and Memory Hierarchy

This directory contains the fixed demo input set for `my-wiki`.

## Files

- `lecture-notes-cache-memory-hierarchy.md`
- `computer-architecture-week4-cache.md`
- `assignment-array-access-cache-analysis.md`

## Expected wiki topics

- 메모리 계층
- 캐시 메모리
- 지역성
- 캐시 히트와 미스
- 배열 접근 패턴과 성능

## Recommended demo chat questions

- 캐시 메모리는 왜 필요한가요?
- 배열 접근 패턴이 왜 성능 차이를 만들었나요?

## Local demo checklist

1. Start the app with `npm run dev`.
2. Open `http://localhost:3000`.
3. Upload the three files in this directory.
4. Confirm generated wiki pages include the expected cache-related topics.
5. Ask:
   - `캐시 메모리는 왜 필요한가요?`
   - `배열 접근 패턴이 왜 성능 차이를 만들었나요?`
6. Capture the flow for screenshots or the README GIF.

## README GIF regeneration

Use the fixed demo dataset directly by starting the app with:

`STUDY_WIKI_DATA_DIR=demo/cache-memory-hierarchy npm run dev -- --port 3000`

Then regenerate the GIF assets with:

1. `npm run demo:capture-frames`
2. `npm run demo:render-gif`

The scripts write intermediate frames to `public/demo/frames/` and the final GIF to `public/demo/study-wiki-demo.gif`.
