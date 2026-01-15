import { Button } from '../../components/Button';

interface HomeProps {
  onGetStarted: () => void;
}

export function Home({ onGetStarted }: HomeProps) {
  return (
    <div className="h-screen-safe w-screen flex flex-col items-center justify-center p-6 safe-area-inset">
      <div className="max-w-md w-full space-y-8">
        {/* Logo/Icon Placeholder */}
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-900 to-emerald-500 flex items-center justify-center shadow-2xl shadow-green-500/50">
            <svg
              className="w-16 h-16 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Party Games
          </h1>
          <p className="text-xl text-gray-400 font-medium">developed by Oscar Zheng</p>
          <p className="text-gray-500 mt-4">built with love (and Cursor)</p>
        </div>

        {/* Buttons */}
        <div className="space-y-4 flex justify-center">
          <Button 
            onClick={onGetStarted} 
            variant="primary"
            className="flex items-center gap-2 max-w-xs"
          >
            <span>Game Selection</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
