import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { AnimatePresence, motion } from "framer-motion"
import AdminHeader from "./AdminHeader"
import AdminSidebar from "./AdminSidebar"
import { cn } from "@/lib/utils"

export default function AdminLayout() {
  const { i18n, t } = useTranslation()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const dir = i18n.dir()
  const isRtl = dir === "rtl"

  const toggleSidebar = () => setCollapsed((current) => !current)

  useEffect(() => {
    if (!mobileSidebarOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [mobileSidebarOpen])

  return (
    <div className="admin-dashboard h-dvh overflow-hidden bg-background text-foreground" dir={dir}>
      <div className="flex h-full min-h-0">
        <div className="hidden h-full min-h-0 md:block">
          <AdminSidebar collapsed={collapsed} />
        </div>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <AdminHeader
            collapsed={collapsed}
            onToggleSidebar={toggleSidebar}
            onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          />
          <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-5 md:p-10">
            <Outlet />
          </main>
        </div>
      </div>

      <AnimatePresence>
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute inset-0 bg-black/60 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] backdrop-blur-sm"
              aria-label={t("admin.actions.closeSidebar")}
            />

            <motion.div
              initial={{ x: isRtl ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? "100%" : "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={cn(
                "absolute bottom-0 top-0 w-[300px] overflow-hidden",
                isRtl ? "right-0" : "left-0"
              )}
            >
              <AdminSidebar
                collapsed={false}
                mobile
                onNavigate={() => setMobileSidebarOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
