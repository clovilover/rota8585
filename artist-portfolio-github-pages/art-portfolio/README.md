# Artist Portfolio — GitHub Pages

화이트 미니멀 스타일의 한국어/영어 일러스트 포트폴리오입니다. Masonry 갤러리, 카테고리 필터, 작품 상세 모달, 관리자 페이지를 포함합니다.

## 1. GitHub Pages 배포

1. 이 폴더의 파일을 GitHub 저장소 루트에 업로드합니다.
2. 저장소의 **Settings → Pages**로 이동합니다.
3. **Deploy from a branch**를 선택하고 `main` 브랜치 / `/ (root)`를 지정합니다.
4. 저장 후 생성된 GitHub Pages 주소로 접속합니다.

## 2. 작품 추가

### 방법 A — GitHub에서 직접 추가
- 이미지를 `images/commission/`, `images/personal/` 등 카테고리 폴더에 업로드합니다.
- `data/artworks.json`에 작품 데이터를 추가합니다.

예시:
```json
{
  "artworks": [
    {
      "id": "sample-01",
      "title": { "ko": "작품 제목", "en": "Artwork title" },
      "category": "personal",
      "date": "2026. 11",
      "description": { "ko": "작품 설명", "en": "Description" },
      "tools": "Clip Studio Paint",
      "image": "images/personal/sample-01.jpg"
    }
  ]
}
```

카테고리 값은 `commission`, `commercial`, `personal`, `thumbnail`, `fanart`, `others` 중 하나를 사용합니다.

### 방법 B — 관리자 페이지
1. 사이트의 `admin.html`에 접속합니다.
2. GitHub 사용자명, 저장소명, 브랜치, 토큰을 입력합니다.
3. Fine-grained personal access token을 만들 때 해당 저장소만 선택하고 **Contents: Read and write** 권한을 부여합니다.
4. 작품을 등록/수정/삭제합니다. 이미지와 `data/artworks.json`이 GitHub에 커밋됩니다.

**보안:** 토큰은 페이지 코드에 저장되지 않습니다. 현재 탭 세션의 `sessionStorage`에만 보관됩니다. 공용 컴퓨터에서는 연결 해제 후 탭을 닫으세요. 토큰을 다른 사람에게 공유하지 마세요. GitHub Pages는 정적 사이트이므로 관리자 URL 자체가 비밀번호로 보호되는 것은 아닙니다.

## 3. 개인 정보 수정
- 메인 소개: `index.html`
- 연락 이메일: `index.html`에서 `your-email@example.com`을 본인 이메일로 변경
- SNS: `index.html`의 Social 영역을 실제 링크로 변경
- 디자인: `css/style.css`
- 언어 문구: `js/app.js`

## 참고
관리자에서 GitHub 연결 없이 저장한 작품은 현재 브라우저의 임시 목록에만 남습니다. JSON 내보내기로 데이터를 내려받아 `data/artworks.json`에 반영하거나 GitHub 연결 후 등록하세요. GitHub 저장 후 Pages 배포가 완료되기까지 잠시 시간이 걸릴 수 있습니다.
