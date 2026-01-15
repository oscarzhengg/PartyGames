import { useState } from 'react';
import { Home } from './features/home/Home';
import { ModeSelection } from './features/ModeSelection';
import { ImposterSetup } from './features/imposter/ImposterSetup';
import { CategorySelection } from './features/imposter/CategorySelection';
import { ImposterPlayerGrid } from './features/imposter/ImposterPlayerGrid';
import { AllReady } from './features/imposter/AllReady';
import { HeadbandsPlaceholder } from './features/headbands/HeadbandsPlaceholder';
import { HeadbandsSetup } from './features/headbands/HeadbandsSetup';
import { HeadbandsGame } from './features/headbands/HeadbandsGame';
import { PageTransition } from './components/PageTransition';
import type { ImposterSettings, RoleAssignment } from './features/imposter/types';
import type { HeadbandsSettings } from './features/headbands/types';
import { CATEGORIES, type Category } from './features/imposter/wordBanks';
import { assignRoles } from './features/imposter/logic';

type Screen = 
  | 'home'
  | 'modeSelection'
  | 'imposterSetup'
  | 'categorySelection'
  | 'imposterPlayerGrid'
  | 'allReady'
  | 'headbandsPlaceholder'
  | 'headbandsSetup'
  | 'headbandsGame';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [previousScreen, setPreviousScreen] = useState<Screen | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(CATEGORIES);
  const [imposterSettings, setImposterSettings] = useState<ImposterSettings | null>(null);
  const [roleAssignment, setRoleAssignment] = useState<RoleAssignment | null>(null);
  const [headbandsSettings, setHeadbandsSettings] = useState<HeadbandsSettings | null>(null);

  const navigateTo = (screen: Screen) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
  };

  const handleGetStarted = () => {
    navigateTo('modeSelection');
  };

  const handleBackToHome = () => {
    navigateTo('home');
    setImposterSettings(null);
    setRoleAssignment(null);
    setHeadbandsSettings(null);
  };

  const handleModeSelection = (mode: 'imposter' | 'headbands') => {
    if (mode === 'imposter') {
      navigateTo('imposterSetup');
    } else {
      navigateTo('headbandsSetup');
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

  const handleHeadbandsSetupContinue = (settings: HeadbandsSettings) => {
    setHeadbandsSettings(settings);
    navigateTo('headbandsGame');
  };

  const handleHeadbandsGameBack = () => {
    navigateTo('headbandsSetup');
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
      'modeSelection',
      'imposterSetup',
      'imposterPlayerGrid',
      'allReady',
      'headbandsPlaceholder',
      'headbandsSetup',
      'headbandsGame',
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
          <Home onGetStarted={handleGetStarted} />
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

      <PageTransition isActive={currentScreen === 'headbandsSetup'} direction={getTransitionDirection('headbandsSetup')}>
        {currentScreen === 'headbandsSetup' && (
          <HeadbandsSetup
            onContinue={handleHeadbandsSetupContinue}
            onBack={() => navigateTo('modeSelection')}
          />
        )}
      </PageTransition>

      <PageTransition isActive={currentScreen === 'headbandsGame'} direction="fade">
        {currentScreen === 'headbandsGame' && headbandsSettings && (
          <HeadbandsGame
            settings={headbandsSettings}
            onBack={handleHeadbandsGameBack}
          />
        )}
      </PageTransition>
    </div>
  );
}

export default App;
