

function UserCard({name}: {name: string}) {
    return (
        <div className="mt-auto pt-6 border-t border-white/5">
            <div className="flex items-center gap-4 p-2 rounded-2xl hover:bg-white/2 transition-colors cursor-pointer group">
                <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-white font-black text-sm shadow-inner">
                        {name.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[#0a0a0a]" />
                </div>
                <div className="flex flex-col">
                    <span className="font-black text-sm text-white font-['Cairo'] group-hover:translate-x-1 transition-transform">{name}</span>
                    <span className="text-[10px] text-[#555] font-medium tracking-tight uppercase">Premium Account</span>
                </div>
            </div>
        </div>
    )
}

export default UserCard