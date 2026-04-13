# 컴퓨터구조 4주차 - Cache와 Memory Hierarchy

## 1. 왜 Memory Hierarchy가 필요한가

- CPU 성능 증가 속도와 memory 접근 속도 사이에는 차이가 존재한다.
- 빠른 저장장치는 비싸고 용량이 작다.
- 느린 저장장치는 저렴하고 용량이 크다.
- 따라서 계층 구조로 성능과 비용의 균형을 맞춘다.

## 2. Memory Hierarchy

- Registers
- Cache
- Main Memory
- Secondary Storage

위 계층에서 위로 갈수록 빠르고 비싸며 용량이 작다.

## 3. Cache Memory의 역할

- CPU와 main memory 사이에서 자주 사용하는 데이터를 빠르게 제공한다.
- 평균 메모리 접근 시간을 줄이는 것이 목적이다.

## 4. Locality

- Temporal Locality: 최근 사용한 데이터 재접근 가능성
- Spatial Locality: 인접한 주소 재접근 가능성

## 5. Cache Hit / Miss

- Hit: 필요한 데이터가 cache에 있는 경우
- Miss: 필요한 데이터가 cache에 없어 main memory 접근이 필요한 경우

## 6. Block 단위 전송

- cache는 데이터를 한 word씩이 아니라 block 단위로 가져온다.
- 인접한 데이터를 함께 가져오면 spatial locality의 효과를 더 잘 활용할 수 있다.
