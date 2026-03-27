# 열관류율 PWA 패치 지침

index.html에 다음 변경사항을 적용하세요:

## 1. 헤더 아이콘 교체
찾기: `<div class="brand-icon">`로 시작하는 SVG 블록
교체:
```html
<div class="brand-icon" style="background:none;padding:0;overflow:hidden;width:42px;height:42px;border-radius:10px;flex-shrink:0;box-shadow:0 2px 10px rgba(29,78,216,.38);">
  <img src="./icons/brand-icon.jpg" alt="열관류율 MANMIN" style="width:42px;height:42px;object-fit:cover;border-radius:10px;display:block;"/>
</div>
```

## 2. 배너 이미지 교체
`icon-192x192.png` → `./icons/brand-icon.jpg`

## 3. sw.js, manifest.json, icons/ 폴더를 같은 디렉토리에 배치
