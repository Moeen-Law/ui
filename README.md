# <p align="center">مُعين (Moeen) - المساعد القانوني الذكي</p>

<p align="center">
  <img src="./public/brand/brand.png" alt="Moeen Law Hero" width="100%" />
</p>

<p align="center">
  <strong>المنصة الرائدة في مصر للذكاء الاصطناعي القانوني</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite" alt="Vite" />
</p>

---

## 🏛️ عن المشروع

**مُعين** هو مشروع تخرج طموح يهدف إلى سد الفجوة بين التكنولوجيا والقانون في مصر. يوفر التطبيق واجهة ذكية مدعومة بالذكاء الاصطناعي لمساعدة المحامين والجمهور على حد سواء في صياغة العقود، تحليل الثغرات القانونية، والحصول على استشارات فورية بناءً على القانون المصري.

---

## ✨ المميزات الرئيسية

### 1. نظام التوثيق المتطور (Full-Featured Auth)
- **تسجيل دخول آمن**: دعم كامل لـ `JWT` و `Access/Refresh Tokens`.
- **Google OAuth**: تكامل سلس مع حسابات جوجل.
- **إدارة الحساب**: استعادة كلمة المرور عبر البريد، التحقق من الحساب، وتعديل البيانات.
- **أمن المستخدم**: تشفير البيانات وتجربة مستخدم تركز على الخصوصية.

### 2. محادثة ذكية (Intelligent AI Chat)
- واجهة دردشة سريعة وتفاعلية.
- دعم كامل للغة العربية (RTL).
- قدرة على معالجة المستندات القانونية وتحليلها.

### 3. تجربة مستخدم فاخرة (Premium UI/UX)
- **تصميم عصري**: استخدام الـ Glassmorphism و Dark Mode بشكل احترافي.
- **حركات تفاعلية**: أنيميشن سلس باستخدام `Framer Motion`.
- **خطوط عربية متميزة**: استخدام خط `Cairo Variable` المخصص للقراءة والجمال.

### 4. بنية تحتية قوية (Robust Infrastructure)
- **Docker Ready**: جاهز للنشر باستخدام حاويات دوكر.
- **CI/CD**: تكامل مع `Woodpecker CI` للأتمتة.
- **Nginx Optimized**: تزويد المشروع بإعدادات Nginx محسنة للأداء العالي.

---

## 🛠️ التقنيات (Tech Stack)

| المجال | التقنية المستخدمة |
| :--- | :--- |
| **الواجهة الأمامية** | React 19 + TypeScript |
| **التنسيق** | Tailwind CSS 4 + Shadcn UI |
| **إدارة الحالة** | Zustand |
| **الحركات** | Framer Motion |
| **النماذج** | React Hook Form + Zod |
| **التوجيه** | React Router 7 |
| **الطلبات (HTTP)** | Axios |
| **الأيقونات** | Lucide React |

---

## 🚀 البدء في العمل

### المتطلبات الأساسية
- Node.js (v18+)
- npm / yarn

### خطوات التشغيل المحلي

1. **استنساخ المستودع**:
   ```bash
   git clone https://github.com/moeen-law/ui.git
   cd moeen-ui
   ```

2. **تثبيت التبعيات**:
   ```bash
   npm install
   ```

3. **إعداد المتغيرات البيئية**:
   قم بإنشاء ملف `.env` بناءً على `.env.example`:
   ```env
   VITE_BASE_URL=https://gateway.moeenlaw.com/auth/api/v1
   ```

4. **تشغيل المشروع**:
   ```bash
   npm run dev
   ```

---

## 🐳 النشر باستخدام Docker

يمكنك بناء وتشغيل المشروع كحاوية (Container) بسهولة:

```bash
# بناء الصورة
docker build -t moeen-ui .

# تشغيل الحاوية
docker run -p 80:80 moeen-ui
```

---

## 📂 هيكل المجلدات (Architecture)

نتبع أسلوب **Feature-Based Module System**:

```text
src/
├── assets/          # الصور والوسائط
├── components/      # المكونات المشتركة و Shadcn UI
├── features/        # الوحدات الوظيفية (Auth, Chat, Landing)
│   ├── auth/        # منطق التوثيق والجلسات
│   ├── chat/        # نظام المحادثة الذكي
│   └── landing/     # صفحة الهبوط والتعريف
├── lib/             # إعدادات المكتبات الخارجية
├── shared/          # الـ Hooks والـ Utils المشتركة
└── main.tsx         # نقطة الدخول الرئيسية
```

---

## 🤝 المساهمة

نحن نرحب بالمساهمات! يرجى قراءة دليل المساهمة قبل إرسال `Pull Request`.

---

## 📄 الترخيص

هذا المشروع ملك لفريق **مُعين** - جميع الحقوق محفوظة © 2026.

<p align="center">
  صُنع بـ ❤️ لخدمة المجتمع القانوني المصري.
</p>
