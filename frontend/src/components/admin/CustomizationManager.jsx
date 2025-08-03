import React from 'react';

const CustomizationManager = ({ groups, setGroups }) => {

  const addGroup = () => {
    setGroups([...groups, { title: '', type: 'SINGLE', maxSelections: 1, options: [] }]);
  };

  const removeGroup = (groupIndex) => {
    setGroups(groups.filter((_, index) => index !== groupIndex));
  };

  const handleGroupChange = (groupIndex, field, value) => {
    const newGroups = [...groups];
    newGroups[groupIndex][field] = value;
    setGroups(newGroups);
  };

  const addOption = (groupIndex) => {
    const newGroups = [...groups];
    newGroups[groupIndex].options.push({ name: '', price: 0 });
    setGroups(newGroups);
  };

  const removeOption = (groupIndex, optionIndex) => {
    const newGroups = [...groups];
    newGroups[groupIndex].options.splice(optionIndex, 1);
    setGroups(newGroups);
  };

  const handleOptionChange = (groupIndex, optionIndex, field, value) => {
    const newGroups = [...groups];
    newGroups[groupIndex].options[optionIndex][field] = value;
    setGroups(newGroups);
  };

  return (
    <div className="p-4 border-t-2 mt-6">
      <h4 className="text-lg font-semibold mb-4">Item Customizations</h4>
      {groups.map((group, groupIndex) => (
        <div key={groupIndex} className="p-4 mb-4 bg-gray-100 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Group Title (e.g., Choose a Drink)"
              value={group.title}
              onChange={(e) => handleGroupChange(groupIndex, 'title', e.target.value)}
              className="p-2 border rounded"
            />
            <select
              value={group.type}
              onChange={(e) => handleGroupChange(groupIndex, 'type', e.target.value)}
              className="p-2 border rounded"
            >
              <option value="SINGLE">Choose One (Radio)</option>
              <option value="MULTIPLE">Choose Many (Checkbox)</option>
            </select>
            <input
              type="number"
              placeholder="Max Selections"
              value={group.maxSelections}
              onChange={(e) => handleGroupChange(groupIndex, 'maxSelections', parseInt(e.target.value) || 1)}
              className="p-2 border rounded"
              min="1"
            />
          </div>
          
          <h5 className="font-semibold mb-2">Options</h5>
          {group.options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Option Name"
                value={option.name}
                onChange={(e) => handleOptionChange(groupIndex, optionIndex, 'name', e.target.value)}
                className="p-2 border rounded flex-grow"
              />
              <input
                type="number"
                placeholder="Additional Price"
                value={option.price}
                onChange={(e) => handleOptionChange(groupIndex, optionIndex, 'price', parseFloat(e.target.value) || 0)}
                className="p-2 border rounded w-32"
                step="0.01"
              />
              <button type="button" onClick={() => removeOption(groupIndex, optionIndex)} className="bg-red-500 text-white p-2 rounded">×</button>
            </div>
          ))}
          
          <div className="flex justify-between mt-4">
            <button type="button" onClick={() => addOption(groupIndex)} className="text-sm bg-green-500 text-white py-1 px-3 rounded">Add Option</button>
            <button type="button" onClick={() => removeGroup(groupIndex)} className="text-sm bg-red-600 text-white py-1 px-3 rounded">Remove Group</button>
          </div>
        </div>
      ))}
      <button type="button" onClick={addGroup} className="mt-4 bg-indigo-500 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700">
        + Add Customization Group
      </button>
    </div>
  );
};

export default CustomizationManager;