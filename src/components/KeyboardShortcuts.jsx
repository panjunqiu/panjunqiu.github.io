import React from "react";

const KeyboardShortcuts = () => {
  return (
    <div className="mt-8 bg-white rounded-lg p-6 shadow-lg hidden sm:block">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">
        键盘快捷键
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
        <div>
          <kbd className="px-2 py-1 bg-gray-100 rounded">A</kbd> = do
        </div>
        <div>
          <kbd className="px-2 py-1 bg-gray-100 rounded">S</kbd> = re
        </div>
        <div>
          <kbd className="px-2 py-1 bg-gray-100 rounded">D</kbd> = mi
        </div>
        <div>
          <kbd className="px-2 py-1 bg-gray-100 rounded">F</kbd> = fa
        </div>
        <div>
          <kbd className="px-2 py-1 bg-gray-100 rounded">G</kbd> = sol
        </div>
        <div>
          <kbd className="px-2 py-1 bg-gray-100 rounded">H</kbd> = la
        </div>
        <div>
          <kbd className="px-2 py-1 bg-gray-100 rounded">J</kbd> = si
        </div>
        <div>
          <kbd className="px-2 py-1 bg-gray-100 rounded">K</kbd> = do₅
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;