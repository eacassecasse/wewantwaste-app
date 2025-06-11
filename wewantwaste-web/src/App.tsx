import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import Progress from './components/progress'
import SkipPage from './features/skip-selection'
import { useProgressStore } from './stores/useProgressStore';

const queryClient = new QueryClient();

function App() {
  const currentStep = useProgressStore((state) => state.currentStep);

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Progress />
        {currentStep === 3 && <SkipPage />}
      </div>
    </QueryClientProvider>
  )
}

export default App
