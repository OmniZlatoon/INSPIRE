'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function ReviewAndFeedback() {
    return (
        <div className="p-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#202124] dark:text-white">Reviews & Feedback</h2>
                <p className="text-[#5f6368] dark:text-gray-400 mt-1 text-sm">View and moderate user reviews and platform feedback submissions.</p>
            </div>

            <div className="flex flex-col items-center justify-center h-[55vh] text-center">
                <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/10 rounded-full flex items-center justify-center mb-6">
                    <MessageSquare size={36} className="text-rose-400 dark:text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-[#202124] dark:text-white mb-2">Reviews & Feedback Coming Soon</h3>
                <p className="text-[#5f6368] dark:text-gray-400 text-sm max-w-sm">
                    This section will display user-submitted reviews and feedback for moderation and response.
                </p>
            </div>
        </div>
    );
}
