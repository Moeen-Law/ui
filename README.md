# مُعين (Moeen) - المساعد القانوني الذكي

**مُعين** هو تطبيق ويب متطور مصمم لتبسيط العمليات القانونية في مصر. يستخدم الذكاء الاصطناعي لتقديم استشارات فورية، تحليل المستندات، وإنشاء العقود بدقة واحترافية.

## 🚀 المميزات الحالية

- **صفحة هبوط (Landing Page) عصرية**: تصميم جذاب يعرض خدمات المنصة وخطط الأسعار.
- **نظام المحادثة الذكي (AI Chat)**: واجهة دردشة متكاملة للتفاعل مع المساعد القانوني.
- **واجهة مستخدم متطورة**: استخدام أحدث التقنيات مثل Glassmorphism و Animations لمنح تجربة مستخدم فاخرة.
- **نظام التوثيق (Auth System)**: صفحات تسجيل دخول وإنشاء حساب متكاملة مع التحقق من البيانات (Form Validation).
- **التجاوب الكامل (Responsive Design)**: يعمل التطبيق بسلاسة على جميع الأجهزة (موبايل، تابلت، ديسكتوب).

## 🛠 التقنيات المستخدمة

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📦 البدء في العمل

```bash
# تثبيت التبعيات
npm install

# تشغيل المشروع في وضع التطوير
npm run dev

# بناء المشروع للإنتاج
npm run build
```

## 📂 هيكل المشروع

تتبع بنية المشروع نمط **Feature-based architecture** لضمان سهولة القراءة والتطوير:

- `src/features/landing`: مكونات وصفحات صفحة الهبوط.
- `src/features/chat`: نظام المحادثة والمكونات المتعلقة به.
- `src/features/auth`: صفحات التحقق والدخول.
- `src/components/ui`: المكونات الأساسية القابلة لإعادة الاستخدام.

---
تم التطوير بواسطة فريق **مُعين** لخدمة المجتمع القانوني المصري.
