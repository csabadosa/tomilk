import React from 'react';

const Form = () => {
  return (
    <div className="flex flex-col bg-gray-100 rounded-lg p-4 shadow-sm">
      <div className="mt-4">
        <label className="text-black" htmlFor="title">
          Név
        </label>
        <input
          placeholder="Foglaló neve"
          className="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1"
          type="text"
        />
      </div>
      <div className="mt-4">
        <label className="text-black" htmlFor="description">
          Description
        </label>
        <textarea
          placeholder="Describe your dream in detail"
          className="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1"
          id="description"
          defaultValue={''}
        />
      </div>
      <div className="mt-4 flex flex-row space-x-2">
        <div className="flex-1">
          <label className="text-black" htmlFor="emotions">
            Emotions
          </label>
          <input
            placeholder="What emotions did you feel during your dream?"
            className="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1"
            id="emotions"
            type="text"
          />
        </div>
        <div className="flex-1">
          <label className="text-black" htmlFor="symbols">
            Symbols
          </label>
          <input
            placeholder="Did you see any symbols in your dream?"
            className="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1"
            id="symbols"
            type="text"
          />
        </div>
      </div>
      <div className="mt-4 flex flex-row space-x-2">
        <div className="flex-1">
          <label className="text-black" htmlFor="themes">
            Themes
          </label>
          <input
            placeholder="What themes do you think your dream might be about?"
            className="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1"
            id="themes"
            type="text"
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          className="bg-white text-black rounded-md px-4 py-1 hover:bg-gray-200 hover:text-gray-900"
          id="generate-button"
          type="button"
        >
          Generate
        </button>
      </div>
    </div>
  );
};

export default Form;
