import { useState } from 'react';
import { Home } from './features/home/Home';
import { HowToPlay } from './features/home/HowToPlay';
import { ModeSelection } from './features/ModeSelection';
import { ImposterSetup } from './features/imposter/ImposterSetup';
import { CategorySelection } from './features/imposter/CategorySelection';
import { ImposterPlayerGrid } from './features/imposter/ImposterPlayerGrid';
import { AllReady } from './features/imposter/AllReady';
import { HeadbandsPlaceholder } from './features/headbands/HeadbandsPlaceholder';
import { PageTransition } from './components/PageTransition';
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
  const [previousScreen, setPreviousScreen] = useState<Screen | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(CATEGORIES);
  const [imposterSettings, setImposterSettings] = useState<ImposterSettings | null>(null);
  const [roleAssignment, setRoleAssignment] = useState<RoleAssignment | null>(null);

  const navigateTo = (screen: Screen) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
  };

  const handleGetStarted = () => {
    navigateTo('modeSelection');
  };

  const handleHowToPlay = () => {
    navigateTo('howToPlay');
  };

  const handleBackToHome = () => {
    navigateTo('home');
    setImposterSettings(null);
    setRoleAssignment(null);
  };

  const handleModeSelection = (mode: 'imposter' | 'headbands') => {
    if (mode === 'imposter') {
      navigateTo('imposterSetup');
    } else {
      navigateTo('headbandsPlaceholder');
    }
  };

  const handleImposterSetupContinue = (settings: ImposterSettings) => {
    const { assignment, secretWord } = assignRoles(settings);
    const settingsWithWord = { ...settings, secretWord };
    setImposterSettings(settingsWithWord);
    setRoleAssignment(assignment);
    navigateTo('imposterPlayerGrid');
  };

  const handleImposterPlayerGridBack = () => {
    navigateTo('imposterSetup');
  };

  const handleAllReady = () => {
    navigateTo('allReady');
  };

  const handleSetupAgain = () => {
    if (imposterSettings) {
      const { assignment, secretWord } = assignRoles(imposterSettings);
      const settingsWithWord = { ...imposterSettings, secretWord };
      setImposterSettings(settingsWithWord);
      setRoleAssignment(assignment);
      navigateTo('imposterPlayerGrid');
    } else {
      navigateTo('imposterSetup');
    }
  };

  const getTransitionDirection = (screen: Screen): 'forward' | 'backward' | 'modal' | 'fade' => {
    if (!previousScreen) return 'fade';
    
    // Modal-style transitions for category selection
    if (screen === 'categorySelection' || previousScreen === 'categorySelection') {
      return 'modal';
    }
    
    // Fade transitions for game state changes
    if (screen === 'imposterPlayerGrid' || screen === 'allReady' || 
        previousScreen === 'imposterPlayerGrid' || previousScreen === 'allReady') {
      return 'fade';
    }
    
    // Determine forward/backward based on screen hierarchy
    const screenOrder: Screen[] = [
      'home',
      'howToPlay',
      'modeSelection',
      'imposterSetup',
      'imposterPlayerGrid',
      'allReady',
      'headbandsPlaceholder',
    ];
    
    const currentIndex = screenOrder.indexOf(screen);
    const previousIndex = screenOrder.indexOf(previousScreen);
    
    if (currentIndex === -1 || previousIndex === -1) return 'fade';
    
    return currentIndex > previousIndex ? 'forward' : 'backward';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] to-black relative overflow-hidden">
      <PageTransition isActive={currentScreen === 'home'} direction="fade">
        {currentScreen === 'home' && (
          <Home onGetStarted={handleGetStarted} onHowToPlay={handleHowToPlay} />
        )}
      </PageTransition>
      
      <PageTransition isActive={currentScreen === 'howToPlay'} direction={getTransitionDirection('howToPlay')}>
        {currentScreen === 'howToPlay' && (
          <HowToPlay onBack={handleBackToHome} />
        )}
      </PageTransition>
      
      <PageTransition isActive={currentScreen === 'modeSelection'} direction={getTransitionDirection('modeSelection')}>
        {currentScreen === 'modeSelection' && (
          <ModeSelection 
            onSelectMode={handleModeSelection}
            onBack={handleBackToHome}
          />
        )}
      </PageTransition>
      
      <PageTransition isActive={currentScreen === 'imposterSetup'} direction={getTransitionDirection('imposterSetup')}>
        {currentScreen === 'imposterSetup' && (
          <ImposterSetup
            selectedCategories={selectedCategories}
            onCategoriesClick={() => navigateTo('categorySelection')}
            onContinue={handleImposterSetupContinue}
            onBack={() => navigateTo('modeSelection')}
          />
        )}
      </PageTransition>
      
      <PageTransition isActive={currentScreen === 'categorySelection'} direction="modal">
        {currentScreen === 'categorySelection' && (
          <CategorySelection
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
            onBack={() => navigateTo('imposterSetup')}
          />
        )}
      </PageTransition>
      
      <PageTransition isActive={currentScreen === 'imposterPlayerGrid'} direction="fade">
        {currentScreen === 'imposterPlayerGrid' && imposterSettings && roleAssignment && (
          <ImposterPlayerGrid
            settings={imposterSettings}
            roleAssignment={roleAssignment}
            onAllReady={handleAllReady}
            onBack={handleImposterPlayerGridBack}
          />
        )}
      </PageTransition>
      
      <PageTransition isActive={currentScreen === 'allReady'} direction="fade">
        {currentScreen === 'allReady' && imposterSettings && roleAssignment && (
          <AllReady
            secretWord={imposterSettings.secretWord}
            roleAssignment={roleAssignment}
            onBackToHome={handleBackToHome}
            onSetupAgain={handleSetupAgain}
          />
        )}
      </PageTransition>
      
      <PageTransition isActive={currentScreen === 'headbandsPlaceholder'} direction={getTransitionDirection('headbandsPlaceholder')}>
        {currentScreen === 'headbandsPlaceholder' && (
          <HeadbandsPlaceholder onBack={() => navigateTo('modeSelection')} />
        )}
      </PageTransition>
    </div>
  );
}

export default App;
