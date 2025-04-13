import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  // State variables
  const [prompt, setPrompt] = useState('');
  const [primaryModel, setPrimaryModel] = useState('grok3beta');
  const [analysisModel, setAnalysisModel] = useState('gpt4o');
  const [primaryResponse, setPrimaryResponse] = useState('');
  const [analysisResponse, setAnalysisResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [konamiMode, setKonamiMode] = useState(false);
  const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  const konamiIndex = useRef(0);

  // Konami code detection
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === konamiSequence[konamiIndex.current]) {
        konamiIndex.current++;
        if (konamiIndex.current === konamiSequence.length) {
          setKonamiMode(true);
          setTimeout(() => setKonamiMode(false), 3000);
          konamiIndex.current = 0;
        }
      } else {
        konamiIndex.current = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // This would be replaced with your actual API endpoint
      const response = await fetch('http://localhost:5000/api/redteam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          attackingLLM: primaryModel,
          evaluatorLLM: analysisModel
        }),
      });
      
      const data = await response.json();
      
      // Update state with response data
      setPrimaryResponse(data.attackResult || 'No response returned from Grok 3 Beta');
      setAnalysisResponse(data.evaluationResult || 'No analysis returned from GPT-4o');
    } catch (error) {
      console.error('Error submitting prompt:', error);
      setPrimaryResponse('Error: Failed to get response from Grok 3 Beta');
      setAnalysisResponse('Error: Failed to get analysis from GPT-4o');
    } finally {
      setIsLoading(false);
    }
  };


  // Navigation
  const handleNavigation = (section) => {
    setActiveSection(section);
  };

  // Render different sections based on activeSection
  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return (
          <>
            <div className="hero-section">
              <h1 className="typing-effect">Grokify_</h1>
              <div className="subtitle">
                <p>{'>'} Unlock Full Control of your LLM<span className="cursor"></span></p>
              </div>
              <div className="hero-actions">
                <button onClick={() => handleNavigation('about')} className="terminal-button">./about.sh</button>
              </div>
            </div>
            
            <div className="playground-section home-playground">
              <h2>$ ./run_playground.sh</h2>
              <div className="input-section">
                <form onSubmit={handleSubmit}>
                  <div className="prompt-container">
                    <label htmlFor="prompt">Your prompt:</label>
                    <textarea
                      id="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Enter a prompt to unleash the potential..."
                      rows={5}
                      required
                    />
                  </div>
                  
                  <div className="model-selection">
                    <div className="model-selector">
                      <label htmlFor="primary-model">Primary Model:</label>
                      <select
                        id="primary-model"
                        value={primaryModel}
                        onChange={(e) => setPrimaryModel(e.target.value)}
                      >
                        <option value="grok3beta">Grok 3 Beta</option>
                      </select>
                    </div>
                    
                    <div className="model-selector">
                      <label htmlFor="analysis-model">Analysis Model:</label>
                      <select
                        id="analysis-model"
                        value={analysisModel}
                        onChange={(e) => setAnalysisModel(e.target.value)}
                      >
                        <option value="gpt4o">GPT-4o</option>
                      </select>
                    </div>
                  </div>
                  
                  <button type="submit" className="submit-button" disabled={isLoading}>
                    {isLoading ? 'Processing...' : '→ Execute'}
                  </button>
                </form>
              </div>
              
              <div className="results-section">
                <div className="result-container">
                  <h2>Grok 3 Beta Response</h2>
                  <div className="result-box">
                    <p className="model-info">Model: Grok 3 Beta</p>
                    <div className="result-content">
                      {primaryResponse || 'Submit a prompt to see Grok 3 Beta response'}
                    </div>
                  </div>
                </div>
                
                <div className="result-container">
                  <h2>GPT-4o Analysis</h2>
                  <div className="result-box">
                    <p className="model-info">Model: GPT-4o</p>
                    <div className="result-content">
                      {analysisResponse || 'Submit a prompt to see GPT-4o analysis'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      
      case 'about':
        return (
          <div className="about-section">
            <h2>$ cat about.txt</h2>
            <div className="terminal-output">
              <pre>{`
  ██████╗ ██████╗  ██████╗ ██╗  ██╗██╗███████╗██╗   ██╗
 ██╔════╝ ██╔══██╗██╔═══██╗██║ ██╔╝██║██╔════╝╚██╗ ██╔╝
 ██║  ███╗██████╔╝██║   ██║█████╔╝ ██║█████╗   ╚████╔╝ 
 ██║   ██║██╔══██╗██║   ██║██╔═██╗ ██║██╔══╝    ╚██╔╝  
 ╚██████╔╝██║  ██║╚██████╔╝██║  ██╗██║██║        ██║   
  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝        ╚═╝   
              `}</pre>
              <p>Grokify is an tool that uses Tree of attacks to optimize prompts and Jailbreak LLMs.</p>
              <p>Our mission is to create tools to show how vulnerable LLMs are right now by empowering people to take advantage of them</p>
              <p>Founded in 2025, at the Launchyard hackathon, our team is at the intersection of cutting-edge research and practical applications.</p>
              <p className="terminal-prompt">$ _</p>
            </div>
            <button onClick={() => handleNavigation('home')} className="terminal-button">cd ..</button>
          </div>
        );
      
      case 'projects':
        return (
          <div className="projects-section">
            <h2>$ ls -la /projects</h2>
            <div className="projects-grid">
              {[
                {
                  id: 1,
                  name: 'Neural Interface',
                  description: 'Brain-computer interface research',
                  status: 'Experimental',
                  icon: '🧠'
                },
                {
                  id: 2,
                  name: 'Quantum Encryption',
                  description: 'Post-quantum cryptography implementation',
                  status: 'Active Development',
                  icon: '🔐'
                },
                {
                  id: 3,
                  name: 'Autonomous Systems',
                  description: 'Self-healing network infrastructure',
                  status: 'Beta Testing',
                  icon: '🤖'
                },
                {
                  id: 4,
                  name: 'Grok Enhancer',
                  description: 'Advanced prompt engineering toolkit',
                  status: 'Production',
                  icon: '🚀'
                }
              ].map(project => (
                <div key={project.id} className="project-card">
                  <div className="project-icon">{project.icon}</div>
                  <h3>{project.name}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-status">Status: {project.status}</div>
                  <div className="project-actions">
                    <button className="mini-button">cat</button>
                    <button className="mini-button">ls -la</button>
                    <button className="mini-button">run</button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => handleNavigation('home')} className="terminal-button">cd ..</button>
          </div>
        );
      
      
      case 'playground':
        return (
          <div className="playground-section">
            <h2>$ ./run_playground.sh</h2>
            <div className="input-section">
              <form onSubmit={handleSubmit}>
                <div className="prompt-container">
                  <label htmlFor="prompt">Your prompt:</label>
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter a prompt to unleash the potential..."
                    rows={5}
                    required
                  />
                </div>
                
                <div className="model-selection">
                  <div className="model-selector">
                    <label htmlFor="primary-model">Primary Model:</label>
                    <select
                      id="primary-model"
                      value={primaryModel}
                      onChange={(e) => setPrimaryModel(e.target.value)}
                    >
                      <option value="grok3beta">Grok 3 Beta</option>
                    </select>
                  </div>
                  
                  <div className="model-selector">
                    <label htmlFor="analysis-model">Analysis Model:</label>
                    <select
                      id="analysis-model"
                      value={analysisModel}
                      onChange={(e) => setAnalysisModel(e.target.value)}
                    >
                      <option value="gpt4o">GPT-4o</option>
                    </select>
                  </div>
                </div>
                
                <button type="submit" className="submit-button" disabled={isLoading}>
                  {isLoading ? 'Processing...' : '→ Execute'}
                </button>
              </form>
            </div>
            
            <div className="results-section">
              <div className="result-container">
                <h2>Grok 3 Beta Response</h2>
                <div className="result-box">
                  <p className="model-info">Model: Grok 3 Beta</p>
                  <div className="result-content">
                    {primaryResponse || 'Submit a prompt to see Grok 3 Beta response'}
                  </div>
                </div>
              </div>
              
              <div className="result-container">
                <h2>GPT-4o Analysis</h2>
                <div className="result-box">
                  <p className="model-info">Model: GPT-4o</p>
                  <div className="result-content">
                    {analysisResponse || 'Submit a prompt to see GPT-4o analysis'}
                  </div>
                </div>
              </div>
            </div>
            <button onClick={() => handleNavigation('home')} className="terminal-button">cd ..</button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`App ${konamiMode ? 'konami-mode' : ''}`}>
      <header className="App-header">
        <nav className="main-nav">
          <div className="logo" onClick={() => handleNavigation('home')}>GROKIFY</div>
          <ul className="nav-links">
            <li><button onClick={() => handleNavigation('about')}>About</button></li>
            <li><button onClick={() => handleNavigation('playground')}>Playground</button></li>
          </ul>
        </nav>
      </header>
      
      <main className="App-main">
        {renderSection()}
      </main>
      
      <footer className="App-footer">
        <p>Grokify Collective // Access Granted // {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
