export type ParsedScreen = {
  name: string;
  description: string;
};

export function parsePrompt(prompt: string): ParsedScreen[] {
  const trimmedPrompt = prompt.trim();
  if (!trimmedPrompt) return [];

  const lines = trimmedPrompt.split('\n').map((line) => line.trim()).filter((line) => line.length > 0);
  
  // Strategy 1: Check for lines ending with ":" (Description block format)
  const hasColonTerminators = lines.some(line => line.endsWith(':'));
  
  if (hasColonTerminators) {
    const screens: ParsedScreen[] = [];
    let currentScreen: ParsedScreen | null = null;
    
    for (const line of lines) {
      if (line.endsWith(':')) {
        if (currentScreen) {
          screens.push(currentScreen);
        }
        currentScreen = {
          name: line.slice(0, -1).trim(),
          description: ''
        };
      } else if (currentScreen) {
        currentScreen.description = currentScreen.description 
          ? `${currentScreen.description}\n${line}` 
          : line;
      }
    }
    
    if (currentScreen) {
      screens.push(currentScreen);
    }
    
    if (screens.length > 0) return screens;
  }

  // Strategy 2: Check for bullet points "- "
  const hasBullets = lines.some(line => line.startsWith('- '));
  
  if (hasBullets) {
    return lines
      .filter(line => line.startsWith('- '))
      .map(line => {
        const content = line.substring(2).trim();
        // distinct name/desc if colon present in bullet line
        const colonIndex = content.indexOf(':');
        if (colonIndex !== -1) {
          return {
            name: content.substring(0, colonIndex).trim(),
            description: content.substring(colonIndex + 1).trim()
          };
        }
        return { name: content, description: '' };
      });
  }

  // Strategy 3: Comma-separated list
  // Only apply if we don't have many lines but have commas, or if it's a single line with commas
  const isSingleLine = lines.length === 1;
  const hasCommas = trimmedPrompt.includes(',');
  
  if (isSingleLine && hasCommas) {
    return trimmedPrompt.split(',').map(item => ({
      name: item.trim(),
      description: ''
    })).filter(s => s.name.length > 0);
  }

  // Strategy 4: Fallback (Line by line)
  return lines.map(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      return {
        name: line.substring(0, colonIndex).trim(),
        description: line.substring(colonIndex + 1).trim()
      };
    }
    return { name: line, description: '' };
  });
}
