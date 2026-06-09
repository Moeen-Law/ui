

import { forwardRef, type HTMLAttributes } from "react"

interface UserCardProps extends HTMLAttributes<HTMLDivElement> {
    name: string
}

const UserCard = forwardRef<HTMLDivElement, UserCardProps>(({ name, className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={`mt-auto pt-6 border-t border-border ${className ?? ""}`}
            {...props}
        >
            <div className="flex items-center gap-4 p-2 rounded-2xl hover:bg-muted transition-colors cursor-pointer group">
                <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center text-foreground font-black text-sm shadow-inner">
                        {name.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-background" />
                </div>
                <div className="flex flex-col">
                    <span className="font-black text-sm text-foreground font-sans group-hover:translate-x-1 transition-transform">{name}</span>
                    <span className="text-[10px] text-muted-foreground font-medium tracking-tight uppercase">Premium Account</span>
                </div>
            </div>
        </div>
    )
})

UserCard.displayName = "UserCard"

export default UserCard