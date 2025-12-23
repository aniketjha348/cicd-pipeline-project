 export function getRandomTailwindColorSet() {
  const color = baseColors[Math.floor(Math.random() * baseColors.length)];
  const intensity = intensities[Math.floor(Math.random() * intensities.length)];
  return {
    bg: `bg-${color}-${intensity}`,
    text: `text-${color}-${intensity}`,
    border: `border-${color}-${intensity}`,
  };
}

const baseColors = [
  'red', 'orange', 'amber', 'yellow',
  'lime', 'green', 'emerald', 'teal',
  'cyan', 'sky', 'blue', 'indigo',
  'violet', 'purple', 'fuchsia', 'pink', 'rose',
];

const intensities = ['400', '500', '600'];

export function getRandomTailwindClass(type: 'bg' | 'text' | 'border' | 'border-l' | 'border-r' | 'border-t' | 'border-b' = 'bg',returnType:'color' | 'colorWithType'='colorWithType'): string {
  const color = baseColors[Math.floor(Math.random() * baseColors.length)];
  const intensity = intensities[Math.floor(Math.random() * intensities.length)];
  if(returnType=="color"){
    return `${color}-${intensity}`
  }
 
  return `${type}-${color}-${intensity}`;
}

interface Data{
  class?:string;
  color?:string;
  value?:string | number;
  colorWithValue?:string
}
export function getRandomColor(type: 'bg' | 'text' | 'border' | 'border-l' | 'border-r' | 'border-t' | 'border-b' = 'bg'): Data {
  const color = baseColors[Math.floor(Math.random() * baseColors.length)];
  const intensity = intensities[Math.floor(Math.random() * intensities.length)];
  

  const data:Data= {class:`${type}-${color}-${intensity}`,
color,
value:intensity,
colorWithValue:`${color}-${intensity}`
}
 
  return data;
}
