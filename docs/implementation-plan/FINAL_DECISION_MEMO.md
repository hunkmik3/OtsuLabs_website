# Final Decision Memo

## 1) Kien truc hien tai co cuu duoc khong?

Co. Kien truc hien tai co nen tang tot (CMS repository abstraction, admin auth/session, work project CMS, technical SEO baseline) va co the mo rong de dat requirement khach ma khong can rewrite toan bo.

## 2) Co can rewrite khong?

Khong. Khuyen nghi **khong rewrite**. Nen thuc hien refactor co kiem soat theo phase, uu tien launch-safe fixes truoc.

## 3) 3 viec phai lam ngay

1. Them redirect manager toi thieu + auto 301 khi doi slug.
2. Hoan thien contact conversion flow (`/api/contact` + thank-you page).
3. Bo sung legal baseline (cookies + terms) va canonical explicit cho core static pages.

## 4) 3 viec de phase sau

1. Migrate services/blog sang CMS-driven content types (bo runtime hardcoded local modules).
2. Unify SEO panel nang cao (nofollow, includeInSitemap, snippet preview, schema selector).
3. Governance features: review state, RBAC, revision history.

## 5) Launch nen theo option nao?

Khuyen nghi **Option A — Conservative launch**:
- Public manh cac route cot loi: `/`, `/about`, `/work`, `/work/[slug]`, `/contact`, `/privacy-policy`.
- Services/blog giu gated/noindex den khi migration CMS hoan tat.

## 6) Refactor scope overall la small / medium / large?

- Launch-safe alignment: **Medium**.
- Full requirement alignment (unified content + governance): **Large**.

## 7) Recommendation cuoi cung

Hay giu nguyen nen tang CMS/work hien tai va di theo lo trinh refactor co kiem soat: hoan thanh hard blockers truoc launch (URL governance + conversion flow + legal/canonical), sau do thong nhat SEO/content layer cho services/blog, roi moi nang cap governance. Cach nay dat requirement khach voi rui ro thap hon rewrite, dong thoi bao toan cac phan da on dinh cua he thong.
