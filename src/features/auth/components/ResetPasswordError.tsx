import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight } from 'lucide-react';

function ResetPasswordError() {
    return (
        
            <div
                className="flex flex-col items-center justify-center py-12 space-y-8 text-center"
            >
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                </div>
                <div className="space-y-4">
                    <p className="text-foreground text-lg font-bold">انتهت صلاحية الرابط</p>
                    <p className="text-muted-foreground max-w-xs mx-auto">يرجى طلب رابط جديد لإعادة تعيين كلمة المرور الخاصة بك.</p>
                </div>
                <Link
                    to="/forgot-password"
                    className="flex items-center gap-2 bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-transform hover:scale-105"
                >
                    طلب رابط جديد
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        
    );
}

export default ResetPasswordError