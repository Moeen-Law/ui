import { pricingPlans } from "../data";

export function Pricing() {
    return (
        <section id="pricing" className="py-24 bg-[#111111]">
            <div className="max-w-[1280px] mx-auto px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4 font-['Cairo']">
                        خطط الأسعار
                    </h2>
                    <p className="text-[#a0a0a0] text-lg md:text-xl font-['Cairo']">
                        اختر الخطة المناسبة لاحتياجاتك
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1100px] mx-auto">
                    {pricingPlans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative bg-[#0a0a0a] border border-[#2a2a2a] rounded-3xl p-10 transition-all duration-300 hover:border-blue-500 hover:-translate-y-2 hover:shadow-2xl ${plan.featured
                                    ? "border-blue-500 bg-linear-to-br from-blue-500/5 to-amber-400/5"
                                    : ""
                                }`}
                        >
                            {plan.featured && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-6 py-1 rounded-full text-xs font-bold font-['Cairo'] tracking-wide">
                                    الأكثر شعبية
                                </div>
                            )}

                            <div className="text-center mb-8 pb-8 border-b border-[#2a2a2a]">
                                <h3 className="text-2xl font-extrabold text-white mb-4 font-['Cairo']">
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline justify-center gap-2">
                                    <span className="text-5xl font-black text-blue-500">
                                        {plan.price}
                                    </span>
                                    <span className="text-lg font-bold text-[#a0a0a0] font-['Cairo']">
                                        جنيه
                                    </span>
                                    <span className="text-sm text-[#707070] font-['Cairo']">
                                        /شهرياً
                                    </span>
                                </div>
                            </div>

                            <ul className="mb-8 space-y-4">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-[#a0a0a0] font-['Cairo']">
                                        <svg
                                            className="w-5 h-5 text-blue-500 shrink-0"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                        >
                                            <path d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`w-full py-4 rounded-xl font-bold text-lg font-['Cairo'] transition-all cursor-pointer ${plan.featured
                                        ? "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-[0_10px_30px_rgba(59,130,246,0.4)]"
                                        : "bg-transparent text-white border-2 border-[#3a3a3a] hover:border-blue-500 hover:bg-blue-500/10"
                                    }`}
                            >
                                {plan.buttonText}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
