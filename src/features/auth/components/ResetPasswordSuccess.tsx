import { CheckCircle2 } from 'lucide-react';

function ResetPasswordSuccess() {
    return (
        
            <div
                className="flex flex-col items-center justify-center py-12 space-y-6 text-center"
            >
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <p className="text-white text-lg font-bold">تم تعيين كلمة المرور الجديدة!</p>
                <p className="text-[#a0a0a0]">سيتم توجيهك إلى صفحة تسجيل الدخول الآن...</p>
            </div>
        
    );
}

export default ResetPasswordSuccess