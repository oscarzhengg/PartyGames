import { useState } from 'react';
import { Home } from './features/home/Home';
import { HowToPlay } from './features/home/HowToPlay';
import { ModeSelection } from './features/ModeSelection';
import { ImposterSetup } from './features/imposter/ImposterSetup';
import { CategorySelection } from './features/imposter/CategorySelection';
import { ImposterPlayerGrid } from './features/imposter/ImposterPlayerGrid';
import { AllReady } from './features/imposter/AllReady';
import { HeadbandsPlaceholder } from './features/headbands/HeadbandsPlaceholder';
import type { ImposterSettings, RoleAssignment } from './features/imposter/types';
import { CATEGORIES, type Category } from './features/imposter/wordBanks';
import { assignRoles } from './features/imposter/logic';

type Screen = 
  | 'home'
  | 'howToPlay'
  | 'modeSelection'
  | 'imposterSetup'
  | 'categorySelection'
  | 'imposterPlayerGrid'
  | 'allReady'
  | 'headbandsPlaceholder';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(CATEGORIES);
  const [imposterSettings, setImposterSettings] = useState<ImposterSettings | null>(null);
  const [roleAssignment, setRoleAssignment] = useState<RoleAssignment | null>(null);

  const handleGetStarted = () => {
    setCurrentScreen('modeSelection');
  };

  const handleHowToPlay = () => {
    setCurrentScreen('howToPlay');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setImposterSettings(null);
    setRoleAssignment(null);
  };

  const handleModeSelection = (mode: 'imposter' | 'headbands') => {
    if (mode === 'imposter') {
      setCurrentScreen('imposterSetup');
    } else {
      setCurrentScreen('headbandsPlaceholder');
    }
  };

  const handleImposterSetupContinue = (settings: ImposterSettings) => {
    const { assignment, secretWord } = assignRoles(settings);
    const settingsWithWord = { ...settings, secretWord };
    setImposterSettings(settingsWithWord);
    setRoleAssignment(assignment);
    setCurrentScreen('imposterPlayerGrid');
  };

  const handleImposterPlayerGridBack = () => {
    setCurrentScreen('imposterSetup');
  };

  const handleAllReady = () => {
    setCurrentScreen('allReady');
  };

  const handleSetupAgain = () => {
    if (imposterSettings) {
      const { assignment, secretWord } = assignRoles(imposterSettings);
      const settingsWithWord = { ...imposterSettings, secretWord };
      setImposterSettings(settingsWithWord);
      setRoleAssignment(assignment);
      setCurrentScreen('imposterPlayerGrid');
    } else {
      setCurrentScreen('imposterSetup');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] to-black">
      {currentScreen === 'home' && (
        <Home onGetStarted={handleGetStarted} onHowToPlay={handleHowToPlay} />
      )}
      
      {currentScreen === 'howToPlay' && (
        <HowToPlay onBack={handleBackToHome} />
      )}
      
      {currentScreen === 'modeSelection' && (
        <ModeSelection 
          onSelectMode={handleModeSelection}
          onBack={handleBackToHome}
        />
      )}
      
      {currentScreen === 'imposterSetup' && (
        <ImposterSetup
          selectedCategories={selectedCategories}
          onCategoriesClick={() => setCurrentScreen('categorySelection')}
          onContinue={handleImposterSetupContinue}
          onBack={() => setCurrentScreen('modeSelection')}
        />
      )}
      
      {currentScreen === 'categorySelection' && (
        <CategorySelection
          selectedCategories={selectedCategories}
          onCategoriesChange={setSelectedCategories}
          onBack={() => setCurrentScreen('imposterSetup')}
        />
      )}
      
      {currentScreen === 'imposterPlayerGrid' && imposterSettings && roleAssignment && (
        <ImposterPlayerGrid
          settings={imposterSettings}
          roleAssignment={roleAssignment}
          onAllReady={handleAllReady}
          onBack={handleImposterPlayerGridBack}
        />
      )}
      
      {currentScreen === 'allReady' && imposterSettings && roleAssignment && (
        <AllReady
          secretWord={imposterSettings.secretWord}
          roleAssignment={roleAssignment}
          onBackToHome={handleBackToHome}
          onSetupAgain={handleSetupAgain}
        />
      )}
      
      {currentScreen === 'headbandsPlaceholder' && (
        <HeadbandsPlaceholder onBack={() => setCurrentScreen('modeSelection')} />
      )}
    </div>
  );
}

export default App;
