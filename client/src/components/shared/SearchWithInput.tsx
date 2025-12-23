
import { ReactNode, useEffect, useState, useRef } from "react";
import { Label } from "../ui/label";
import { School, Search, X } from "lucide-react";
import { Input } from "../ui/input";

interface Suggestion {
  _id: string;
  name: string;
  [key: string]: any;
}

interface RandomColor {
  colorWithValue: string;
}

interface SearchWithInputProps {
  ShowChildren?: (props: { suggestion: Suggestion }) => React.ReactNode;
  data?: Suggestion[];
  onSelect?: (value: Suggestion) => void;
  onChange?: (value: string) => void;
  onReset?: () => void;
  inputPlaceholder?: string;
  labelName?: string;
  labelIcon?: ReactNode;
  randomColor?: RandomColor;
  inputClass?: string;
  value?: string;
  [key: string]: any;
   onValueChange?: (value: string) => void;
}

export const SearchWithInput = ({
  ShowChildren,
  data = [],
  onSelect,
  onChange,
  inputPlaceholder,
  labelName,
  labelIcon,
  randomColor,
  inputClass,
  value,
  onReset,
  onValueChange
}: SearchWithInputProps) => {
  const [searchName, setSearchName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);
  const [searchCache, setSearchCache] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  const searchTerm = searchName.trim().toLowerCase();

  const filteredData = searchName
    ? data.filter(item =>
        item.name.toLowerCase().includes(searchTerm?.toLowerCase())
      )
    : data;

  useEffect(() => {
    console.log("hekko");
    
    const timeout = setTimeout(() => {

      const existsLocally = data?.some(item =>
        item.name.toLowerCase().includes(searchTerm)
      );

      if (
        onChange &&
        searchTerm.length > 0 &&
        !existsLocally &&
        !searchCache.has(searchTerm)
      ) {
        onChange(searchName);
        setSearchCache(prev => new Set(prev).add(searchTerm));
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchName, data, onChange]);

  // useEffect(()=>{
  //   setSearchName(value ?? "")
  // },[value])


  const handleOnFocus = () => {
    if (onChange && typeof onChange === "function" ) {
      onChange(searchName);
    }
    setShowModal(true);
  };

  const handleOnSelect = (suggestion: Suggestion) => {
    setSearchName(suggestion.name);
    setHoveredIndex(-1);
    if (onSelect) onSelect(suggestion);
    setShowModal(false);
  };

  const reset = () => {
    if (onReset) onReset();
    setSearchName("");
    setHoveredIndex(-1);
  };

  const highlightText = (text: string, highlight: string) => {
    const idx = text.toLowerCase().indexOf(highlight.toLowerCase());
    if (idx === -1 || !highlight) return text;

    return (
      <>
        {text.slice(0, idx)}
        <strong className={`text-${randomColor?.colorWithValue}`}>{text.slice(idx, idx + highlight.length)}</strong>
        {text.slice(idx + highlight.length)}
      </>
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showModal || filteredData.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHoveredIndex(prev =>
        prev < filteredData.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHoveredIndex(prev =>
        prev > 0 ? prev - 1 : filteredData.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (hoveredIndex >= 0 && hoveredIndex < filteredData.length) {
        handleOnSelect(filteredData[hoveredIndex]);
      }
    }
  };

  return (
    <div className="space-y-2 relative">
      <Label htmlFor="collegeName" className="text-sm font-medium text-color flex items-center">
        <p className={`first:mr-2 ${randomColor?.colorWithValue ? `text-${randomColor.colorWithValue}` : "text-gray-500"}`}>
 {labelIcon ?? (
          <School className={`w-4 h-4 mr-2 `} />
        )}

        </p>
       
        {labelName ?? "College Name"}
      </Label>

      <div className={`relative ${inputClass}`}>
        <Input
          id="collegeName"
          placeholder={inputPlaceholder ?? "Search for your college..."}
          value={value !== undefined ? value : searchName}
          onChange={(e) => {
            const val = e.target.value;
    if(typeof onValueChange ==="function") onValueChange(val)
            
            setSearchName(val);
            setShowModal(true);
            setHoveredIndex(-1);
          }}
          onFocus={handleOnFocus}
          onBlur={() => setTimeout(() => setShowModal(false), 200)}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          className="border-gray-300 z-[1] placeholder:text-color-thin focus:border-indigo-500 focus:ring-indigo-500 pr-8 truncate"
        />
        {!searchName ? (
          <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
        ) : (
          <X
            className="absolute right-3 top-3 h-4 w-4 text-gray-400 cursor-pointer"
            onClick={reset}
          />
        )}
      </div>

      {showModal && (
        <div className={`bg-color absolute w-full rounded flex shadow-md text-color min-w-[200px] top-full left-0 flex-col max-h-[200px] overflow-auto opacity-100 right-0 z-[5000000] mt-1 bg-red-900 p-2 border border-${randomColor?.colorWithValue}`}>
          {filteredData.length > 0 ? (
            filteredData.slice(0, 8).map((suggestion, index) => (
              <span
                key={suggestion._id}
                onMouseDown={() => handleOnSelect(suggestion)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(-1)}
                className={`cursor-pointer rounded p-1 ${
                  hoveredIndex === index ? "bg-slate-600 text-white" : "hover:bg-slate-500"
                }`}
              >
                {ShowChildren ? (
                  ShowChildren({ suggestion })
                ) : (
                  <section className="flex flex-col">
                    <span className="font-medium">
                      {highlightText(suggestion.name, searchName)}
                    </span>
                    <span className="text-sm text-gray-300">ID: {suggestion._id}</span>
                  </section>
                )}
              </span>
            ))
          ) : (
            <span className="w-full h-full flex items-center justify-center text-sm text-gray-300">
              No Results Found
            </span>
          )}
        </div>
      )}
    </div>
  );
};
