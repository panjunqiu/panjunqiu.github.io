import React from 'react';

const Piano = ({ onKeyPress, disabled }) => {
  const notes = [
    { name: 'C4', label: 'do', type: 'white', key: 'A' },
    { name: 'D4', label: 're', type: 'white', key: 'S' },
    { name: 'E4', label: 'mi', type: 'white', key: 'D' },
    { name: 'F4', label: 'fa', type: 'white', key: 'F' },
    { name: 'G4', label: 'sol', type: 'white', key: 'G' },
    { name: 'A4', label: 'la', type: 'white', key: 'H' },
    { name: 'B4', label: 'si', type: 'white', key: 'J' },
    { name: 'C5', label: 'do₅', type: 'white', key: 'K' },
    { name: 'D5', label: 're₅', type: 'white', key: 'L' },
    { name: 'E5', label: 'mi₅', type: 'white', key: ';' },
    { name: 'F5', label: 'fa₅', type: 'white', key: "'" },
    { name: 'G5', label: 'sol₅', type: 'white', key: 'Enter' },
    { name: 'A5', label: 'la₅', type: 'white', key: 'Shift' },
  ];

  React.useEffect(() => {
    const handleKeyPress = (e) => {
      if (disabled) return;
      
      const note = notes.find(n => n.key.toLowerCase() === e.key.toLowerCase());
      if (note) {
        onKeyPress(note.name);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [disabled, onKeyPress]);

  return (
    <div className="flex justify-center items-end gap-0.5 sm:gap-1 p-2 sm:p-8 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-2xl overflow-x-auto">
      {notes.map((note) => (
        <button
          key={note.name}
          onClick={() => !disabled && onKeyPress(note.name)}
          disabled={disabled}
          className={`piano-key ${note.type} relative flex flex-col items-center justify-end pb-1 sm:pb-2 min-w-0 flex-shrink-0 ${
            note.type === 'white'
              ? 'w-8 sm:w-12 h-28 sm:h-40 rounded-b-lg'
              : 'w-5 sm:w-8 h-16 sm:h-24 -mx-2 sm:-mx-4 z-10 rounded-b-md'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
        >
          <span className={`text-[10px] sm:text-xs font-semibold ${
            note.type === 'white' ? 'text-gray-700' : 'text-white'
          }`}>
            {note.label}
          </span>
          <span className={`text-[8px] sm:text-[10px] hidden sm:block ${
            note.type === 'white' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {note.key}
          </span>
        </button>
      ))}
    </div>
  );
};

export default Piano;
