# 컴퓨터구조 필기 - Cache와 Memory Hierarchy

수업 주제: cache memory, memory hierarchy, locality

- CPU 속도는 빠르지만 main memory 접근은 상대적으로 느리다.
- 모든 데이터를 가장 빠른 저장장치에 둘 수 없어서 memory hierarchy가 필요하다.
- register -> cache -> main memory -> storage 순서로 갈수록 느려지고 용량은 커진다.

## Cache Memory

- cache는 CPU와 main memory 사이에 있는 빠른 저장공간이다.
- 최근 또는 자주 사용할 가능성이 높은 데이터를 가까이 둔다.
- 필요한 데이터가 cache에 있으면 cache hit, 없으면 cache miss이다.

## Locality

- temporal locality: 최근 접근한 데이터를 다시 접근할 가능성이 높다.
- spatial locality: 가까운 주소를 연속해서 접근할 가능성이 높다.
- cache는 locality를 이용해 평균 접근 시간을 줄인다.

## 추가 메모

- cache는 보통 block 단위로 데이터를 가져온다.
- nearby data를 같이 가져오면 spatial locality에서 이득을 볼 수 있다.
- 프로그램의 접근 패턴이 locality와 맞지 않으면 miss가 늘어날 수 있다.
