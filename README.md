

# 💫 위슈 - 우선순위 관리 서비스

> '우선순위'가 정해지지 않아서 할 일은 많지만 손대기 어려웠던 적 없으신가요?  
이런 순간을 위해 **위슈**가 탄생했어요!  

위슈(WISHU)는 평소 이루고 싶었던 위시(Wish)들을 카테고리별로 정리하고
4사분면 기반의 시각적 보드를 통해 **우선순위를 한눈에 파악할 수 있게 도와주는 서비스**입니다.  

또한, 정기적인 이메일 알림으로 목표 달성을 돕고
**위시 관리의 빈틈을 채워주는 우선순위 도우미**입니다.

---

## 주요 기능

### 로그인 및 이메일 알림
- **카카오 소셜 로그인** 지원
- **회원가입 시** 환영 이메일 전송
- **가입 7일 후** 리마인드 이메일 발송  
  → “가입한 지 일주일이 되었어요! 이번 주엔 3개의 위시카드를 달성해보는 건 어때요?”

---

### 위시 보드 (4사분면 UI 기반)
- 사용자는 폴더(카테고리)를 만들고 
  그 안에서 위시카드를 원하는 4사분면 위치에 배치할 수 있습니다.
- 직관적인 구조로 **우선순위를 파악할 수 있다는 것이 저희 팀의 핵심 포인트입니다**.

---

### API 기능

> 폴더 및 위시카드 중심의 RESTful API 제공

#### 폴더 API
- 폴더 생성/삭제
- 축 이름 설정 및 수정
- 폴더 이름 수정
- 유저의 모든 폴더 조회

#### 위시카드 API
- 위시카드 생성
- 제목/내용 수정
- 접힌 상태(on/off) 변경
- 위시카드 달성 처리
- 특정 폴더 내 카드 전체 조회
- 유저의 모든 카드 조회
- 위시카드 삭제
- 검색 기능 지원
- 유저가 달성한 전체 위시 수 + 폴더별 달성 수 조회

---

## 사용 방법

1. `.env` 설정
   ```bash
   src/envs/development.env
   # 환경변수(.env) 작성
   ```

2. 프로젝트 실행
   ```bash
   yarn install
   yarn start:dev
   ```
3. PostgreSQL 설정 필요 (DB 연결 정보는 .env에 입력)


### 테스트
주요 로직에 대한 단위 테스트가 작성되어 있습니다.

실행 명령어
   ```bash
   yarn test
   ```

---


## 기술 스택

| Category        | Stack                     |
|-----------------|---------------------------|
| **Framework**   | NestJS                    |
| **Language**    | TypeScript                |
| **Database**    | PostgreSQL                |
| **Auth**        | JWT                       |
| **Infra**       | Docker, Yarn              |




---

## 프로젝트 기획서
[wishu-기획서.pdf](https://github.com/user-attachments/files/19725690/wishu-.pdf)


<br/>
<br/>
   
