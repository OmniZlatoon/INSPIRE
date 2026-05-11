import { WifiOff, RefreshCcw } from "lucide-react"
export function OfflineMode() {

    return (


        <div className="flex flex-col items-center justify-center h-[50vh] text-center animate-in fade-in duration-500">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                <WifiOff size={32} className="text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#202124] dark:text-white mb-1">No Internet Connection</h3>
            <p className="text-[#5f6368] dark:text-gray-400 text-sm max-w-xs">
                Statistics will load automatically once your connection is restored.
            </p>
            <div className="flex items-center text-primary font-medium bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full mt-4">
                <RefreshCcw size={16} className="animate-spin mr-3 text-primary" />
                Waiting for connection...
            </div>
        </div>

    )

}