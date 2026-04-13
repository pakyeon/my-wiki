[English](./README.md) | [한국어](./README-ko.md)

## My Wiki

강의 필기, 수업 PDF, 과제나 요약 문서는 자주 여러 곳에 흩어져 남습니다. 자료는 충분히 쌓였는데도, 막상 복습하려고 하면 흐름이 끊기고 어떤 내용이 서로 연결되는지 빠르게 파악하기 어려운 경우가 많습니다.

My Wiki는 이런 학습 자료를 주제별 위키 문서로 다시 정리하고, 연결된 문서를 따라가며 복습하거나 위키 기반 AI Chat으로 내용을 확인할 수 있게 돕는 Next.js 앱입니다.

## 프로젝트 개요

- 강의 필기, PDF, 과제/요약 문서를 업로드합니다.
- 업로드된 자료를 바탕으로 주제별 위키 문서를 생성합니다.
- 서로 관련 있는 문서를 링크로 연결해 학습 흐름을 따라 탐색할 수 있습니다.
- 생성된 위키를 기준으로 AI Chat에서 내용을 다시 확인할 수 있습니다.

이 프로젝트는 Andrej Karpathy가 제시한 [LLM-WIKI](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)를 기반으로 구현되었습니다.

## 데모 시나리오

고정 데모 시나리오는 `data/demo/cache-memory-hierarchy/` 아래의 `컴퓨터구조 - 캐시와 메모리 계층` 자료 세트를 사용합니다.

권장 시연 흐름:

1. 강의 필기, 슬라이드 자료, 과제 요약 문서를 업로드합니다.
2. `캐시 메모리`, `지역성`, `배열 접근 패턴과 성능` 같은 위키 문서를 생성합니다.
3. 관련 위키 문서를 열고 문서 간 링크를 따라 이동합니다.
4. `캐시 메모리는 왜 필요한가요?` 같은 질문을 위키 기반 Chat으로 확인합니다.

## 데모 GIF

README용 데모 GIF는 위 시나리오를 기준으로 캡처해 `public/demo/study-wiki-demo.gif`에 저장하면 됩니다.

![Study Wiki 데모](./public/demo/study-wiki-demo.gif)

## 핵심 흐름

1. 학습 자료를 업로드합니다.
2. 시스템이 자료를 읽고 주제별 위키 문서를 생성합니다.
3. 생성된 위키 문서를 탐색하며 관련 문서 링크를 따라갑니다.
4. 궁금한 점은 위키 기반 AI Chat으로 바로 확인합니다.

## 로컬 실행

1. 의존성을 설치합니다.

```bash
npm install
```

2. `my-wiki/.env.local` 파일을 만듭니다.

3. 개발 서버를 실행합니다.

```bash
npm run dev
```

4. `http://localhost:3000`을 엽니다.

## 로컬 GGUF 채팅 서버

채팅 백엔드는 OpenAI 호환 엔드포인트를 기대합니다. 이 MVP에서는 로컬 `llama.cpp` 서버가 잘 맞습니다.

예시 서버 실행 명령:

```bash
./llama-server \
  -m /models/gemma-4-E4B-it-Q4_K_M.gguf \
  --host 127.0.0.1 \
  --port 8080
```

`.env.local`에는 OpenAI 호환 베이스 URL을 넣습니다.

```bash
CHAT_MODEL_BASE_URL=http://127.0.0.1:8080/v1
CHAT_MODEL_API_KEY=local
CHAT_MODEL_NAME=gemma-4-e4-b-it-q4
```

## 환경 변수

`my-wiki/.env.local`에 아래 값을 설정합니다.

- `CHAT_MODEL_BASE_URL`: `http://127.0.0.1:8080/v1` 같은 OpenAI 호환 채팅 엔드포인트
- `CHAT_MODEL_API_KEY`: 로컬 서버가 허용하는 임의 문자열. `llama.cpp`에서는 `local`로 충분합니다.
- `CHAT_MODEL_NAME`: 서버가 기대하는 모델 이름 또는 로컬 별칭. 예: `gemma-4-e4-b-it-q4`
- `STUDY_WIKI_DATA_DIR`: `./data` 아래에서만 쓰는 선택적 상대 하위 디렉터리. 예: `demo-run-1`, `test/session-a`

## 위키 기반 응답 방식

- 채팅 응답은 생성된 위키 문서를 근거로 구성합니다.
- 이 MVP는 벡터 데이터베이스 없이 위키 문서 자체를 중심으로 동작합니다.
- 라우트는 모델 호출 전에 로컬 저장소의 위키 문서를 먼저 랭킹합니다.
- 관련 문서를 찾지 못하면 API가 위키 기준으로 답변 범위를 안내합니다.
- 프롬프트는 제공된 위키 발췌문을 중심으로 답하고, 위키에 없는 내용은 분리해서 말하도록 지시합니다.

## 검증 명령어

`my-wiki/`에서 아래 검증을 실행합니다.

```bash
npx vitest run
npm run lint
npm run build
```

앱은 기본적으로 `./data` 아래에 위키 파일을 저장합니다. `STUDY_WIKI_DATA_DIR`를 설정할 때는 절대 경로 대신 반드시 `./data` 기준 상대 경로를 사용해야 합니다.
