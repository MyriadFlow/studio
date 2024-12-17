import React, { useState } from "react";
import { TagsInputProps } from "../utils/phygitals";

export const TagsInput: React.FC<TagsInputProps> = ({ selectedTags, tags }) => {
  const [tagList, setTagList] = useState<string[]>(tags);

  const removeTags = (indexToRemove: number) => {
    const updatedTags = tagList.filter((_, index) => index !== indexToRemove);
    setTagList(updatedTags);
    selectedTags(updatedTags);
  };

  const addTags = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const inputValue = (event.target as HTMLInputElement).value.trim();
      if (
        inputValue !== "" &&
        !tagList.includes(inputValue) &&
        tagList.length < 5
      ) {
        const updatedTags = [...tagList, inputValue];
        setTagList(updatedTags);
        selectedTags(updatedTags);
        (event.target as HTMLInputElement).value = "";
      }
    }
  };

  return (
    <div className="flex flex-wrap items-start min-h-12 w-[50%] p-1 border border-gray-300 rounded-md focus-within:border-blue-500">
      <ul id="tags" className="flex flex-wrap p-0 m-0">
        {tagList.map((tag, index) => (
          <li
            key={index}
            className="flex items-center justify-center h-8 px-2 mr-2 mb-2 text-white bg-blue-600 rounded-md"
          >
            <span className="tag-title">{tag}</span>
            <span
              className="ml-2 w-4 h-4 flex items-center justify-center text-blue-600 bg-white rounded-full cursor-pointer"
              onClick={() => removeTags(index)}
            >
              ×
            </span>
          </li>
        ))}
      </ul>
      <input
        type="text"
        onKeyDown={addTags}
        placeholder="Add a tag and press enter"
        className="flex-1 border-none h-12 text-lg p-1 focus:outline-none"
      />
    </div>
  );
};
