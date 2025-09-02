import React, { useState, useEffect } from 'react';

const DEFAULT_COLORS = ['#f6c54b', '#4caf50', '#ef5350', '#42a5f5', '#ab47bc', '#ffb74d'];

export default function TowerOfHanoi({ initialDisks = 4, colors = DEFAULT_COLORS }) {
  const [rods, setRods] = useState([[...Array(initialDisks).keys()].map(i => initialDisks - i), [], []]);
  const [picked, setPicked] = useState(null);
  const [solved, setSolved] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentView, setCurrentView] = useState('game');
  const [playerName, setPlayerName] = useState("");

  const N = initialDisks;

  const pegHeight = 220;
  const baseHeight = 20;
  const pegPostWidth = 14;
  const diskHeight = 24;
  const diskGap = 0;
  const minDiskWidth = 80;
  const maxDiskWidth = 200;

  useEffect(() => {
    let interval;
    if (timerOn) {
      interval = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [timerOn, startTime]);

  function diskWidthFor(size) {
    if (N <= 1) return minDiskWidth;
    const norm = (size - 1) / (N - 1);
    return Math.round(minDiskWidth + norm * (maxDiskWidth - minDiskWidth));
  }

  function handleRodClick(rIdx) {
    if (solved || !timerOn) return;
    if (picked == null) {
      if (rods[rIdx].length === 0) return;
      setPicked(rIdx);
    } else {
      if (picked === rIdx) {
        setPicked(null);
        return;
      }
      const newRods = rods.map(r => [...r]);
      const disk = newRods[picked][newRods[picked].length - 1];
      const dest = newRods[rIdx][newRods[rIdx].length - 1];
      if (dest == null || disk < dest) {
        newRods[picked].pop();
        newRods[rIdx].push(disk);
        setRods(newRods);
        if (newRods[2].length === N) {
          setSolved(true);
          setTimerOn(false);
          setCurrentView('congratulations');
        }
      }
      setPicked(null);
    }
  }

  function handleReset() {
    // Only update the leaderboard when returning from the congratulations screen
    if (currentView === 'congratulations') {
      const newEntry = { name: playerName || "Anonymous", time: elapsed };
      const updated = [...leaderboard, newEntry].sort((a, b) => a.time - b.time);
      setLeaderboard(updated);
    }
    setRods([[...Array(initialDisks).keys()].map(i => initialDisks - i), [], []]);
    setPicked(null);
    setSolved(false);
    setElapsed(0);
    setTimerOn(false);
    setStartTime(null);
    setCurrentView('game');
    setPlayerName("");
  }

  function handleStartStop() {
    if (timerOn) {
      setTimerOn(false);
    } else {
      setStartTime(Date.now());
      setElapsed(0);
      setTimerOn(true);
      setSolved(false);
    }
  }

  function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  const buttonStyle = {
    padding: '8px 16px',
    fontSize: '1rem',
    borderRadius: 6,
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    transition: 'transform 0.1s ease, box-shadow 0.1s ease',
  };

  const buttonHoverActiveStyle = {
    transform: 'scale(0.98)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  };

  const buttonColors = {
    reset: '#1976d2',
    start: '#388e3c',
    stop: '#d32f2f',
    leaderboard: '#f57c00',
    return: '#1976d2',
  };

  function renderGameScreen() {
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#fafafa', margin: 0, position: 'relative' }}>
        <h1 style={{ marginBottom: 20, fontSize: '2rem', fontWeight: '600', color: '#222' }}>CS Club: Tower of Hanoi</h1>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <button
            onClick={handleReset}
            style={{ ...buttonStyle, background: buttonColors.reset }}
            onMouseOver={e => e.currentTarget.style.transform = buttonHoverActiveStyle.transform}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseDown={e => e.currentTarget.style.transform = buttonHoverActiveStyle.transform}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Reset
          </button>
          <button
            onClick={handleStartStop}
            style={{ ...buttonStyle, background: timerOn ? buttonColors.stop : buttonColors.start }}
            onMouseOver={e => e.currentTarget.style.transform = buttonHoverActiveStyle.transform}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseDown={e => e.currentTarget.style.transform = buttonHoverActiveStyle.transform}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {timerOn ? 'Stop' : 'Start'}
          </button>
          <button
            onClick={() => setCurrentView('leaderboard')}
            style={{ ...buttonStyle, background: buttonColors.leaderboard }}
            onMouseOver={e => e.currentTarget.style.transform = buttonHoverActiveStyle.transform}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseDown={e => e.currentTarget.style.transform = buttonHoverActiveStyle.transform}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            View Leaderboard
          </button>
        </div>

        <div style={{ marginBottom: 40, fontSize: '1.2rem', fontWeight: '500', color: '#222' }}>Time: {formatTime(elapsed)}</div>

        <div style={{ flex: 1, display: 'flex', gap: 80, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          {rods.map((rod, rIdx) => (
            <div
              key={rIdx}
              style={{ position: 'relative', width: 260, height: pegHeight + baseHeight + 8, cursor: 'pointer' }}
              onClick={() => handleRodClick(rIdx)}
            >
              <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: baseHeight, width: pegPostWidth, height: pegHeight, background: '#0b0b0b', borderRadius: pegPostWidth / 2 }} />

              <div style={{ position: 'absolute', left: 0, right: 0, bottom: baseHeight, height: pegHeight }} aria-hidden>
                {rod.map((size, idx) => {
                  const w = diskWidthFor(size);
                  const bottom = idx * (diskHeight + diskGap);
                  const color = colors[(size - 1) % colors.length];
                  return (
                    <div
                      key={idx}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bottom: bottom,
                        width: w,
                        height: diskHeight,
                        borderRadius: diskHeight / 4,
                        background: color,
                        boxShadow: '0 4px 8px rgba(0,0,0,0.22)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#1a1a1a',
                        userSelect: 'none',
                        outline: picked === rIdx && idx === rod.length - 1 ? '3px solid #ff9800' : 'none'
                      }}
                    >
                      <span style={{ opacity: 0 }}>{size}</span>
                    </div>
                  );
                })}
              </div>

              <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 0, width: 200, height: baseHeight, background: '#0b0b0b', borderRadius: 8 }} />
              {rIdx === rods.length - 1 && (
                <p style={{ position: 'absolute', bottom: -65, left: '50%', transform: 'translateX(-50%)', fontWeight: 'bold', fontSize: '20px', color: '#1976d2' }}>
                  Target
                </p>
              )}
            </div>
          ))}
        </div>

        <div style={{ position: 'absolute', top: 20, right: 20, background: '#fff', padding: '12px 16px', borderRadius: 8, boxShadow: '0 2px 6px rgba(0,0,0,0.15)', minWidth: 180 }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: 10, color: '#000' }}>Leaderboard</h2>
          {leaderboard.length === 0 ? (
            <p style={{ fontSize: '0.9rem', color: '#444' }}>No scores yet.</p>
          ) : (
            <ol style={{ margin: 0, paddingLeft: 20, color: '#000' }}>
              {leaderboard.slice(0, 5).map((entry, idx) => (
                <li key={idx} style={{ fontSize: '0.9rem', marginBottom: 4 }}>
                  {entry.name}: {formatTime(entry.time)}
                </li>
              ))}
            </ol>
          )}
        </div>
        <div style={{ position: 'absolute', top: 20, left: 20, background: '#fff', padding: '12px 16px', borderRadius: 8, boxShadow: '0 2px 6px rgba(0,0,0,0.15)', maxWidth: 250 }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: 10, color: '#000' }}>Instructions</h2>
          <p style={{ fontSize: '0.9rem', color: '#444' }}>
            The objective is to move the entire stack from the first rod to the last rod, obeying three rules:
          </p>
          <ul style={{ fontSize: '0.9rem', color: '#444', paddingLeft: 20, listStyleType: 'disc' }}>
            <li style={{ marginBottom: '4px' }}>Only one disk may be moved at a time.</li>
            <li style={{ marginBottom: '4px' }}>Each move consists of taking the upper disk from one of the rods and placing it on top of another rod or an empty rod.</li>
            <li>No disk may be placed on top of a smaller disk.</li>
          </ul>
        </div>
      </div>
    );
  }

  function renderCongratulationsScreen() {
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#fafafa' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#388e3c' }}>Congratulations!</h1>
        <p style={{ fontSize: '1.5rem', color: '#222', marginTop: 10 }}>You completed the puzzle in:</p>
        <p style={{ fontSize: '3rem', fontWeight: 'bold', color: '#1976d2', margin: '20px 0' }}>{formatTime(elapsed)}</p>
        
        <div style={{ background: '#fff', padding: '12px 16px', borderRadius: 8, boxShadow: '0 2px 6px rgba(0,0,0,0.15)', marginBottom: 20 }}>
          <label style={{ marginRight: 8, fontWeight: '500', color: '#000' }}>Enter Name (optional):</label>
          <input
            type="text"
            value={playerName}
            onChange={e => setPlayerName(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid #ccc' }}
          />
        </div>

        <button
          onClick={handleReset}
          style={{ ...buttonStyle, background: buttonColors.return, padding: '12px 24px', fontSize: '1.2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.15)' }}
          onMouseOver={e => e.currentTarget.style.transform = buttonHoverActiveStyle.transform}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          onMouseDown={e => e.currentTarget.style.transform = buttonHoverActiveStyle.transform}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          Return to Main
        </button>
      </div>
    );
  }
  
  function renderLeaderboardScreen() {
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#fafafa', padding: '20px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '600', color: '#222', marginBottom: '20px' }}>Global Leaderboard</h1>
        
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', maxWidth: '500px', width: '100%', overflowY: 'auto', maxHeight: '70vh' }}>
          {leaderboard.length === 0 ? (
            <p style={{ fontSize: '1rem', color: '#444', textAlign: 'center' }}>No scores have been recorded yet.</p>
          ) : (
            <ol style={{ margin: 0, paddingLeft: 0, listStyleType: 'none' }}>
              {leaderboard.map((entry, idx) => (
                <li key={idx} style={{ fontSize: '1.1rem', marginBottom: '10px', padding: '10px', background: idx % 2 === 0 ? '#f0f0f0' : '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', color: '#222' }}>{entry.name}</span>
                  <span style={{ color: '#555' }}>{formatTime(entry.time)}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
        
        <button
          onClick={() => setCurrentView('game')}
          style={{ ...buttonStyle, background: buttonColors.return, padding: '12px 24px', fontSize: '1.2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.15)', marginTop: '20px' }}
          onMouseOver={e => e.currentTarget.style.transform = buttonHoverActiveStyle.transform}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          onMouseDown={e => e.currentTarget.style.transform = buttonHoverActiveStyle.transform}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          Return to Main
        </button>
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'game':
        return renderGameScreen();
      case 'congratulations':
        return renderCongratulationsScreen();
      case 'leaderboard':
        return renderLeaderboardScreen();
      default:
        return renderGameScreen();
    }
  };

  return renderView();
}
