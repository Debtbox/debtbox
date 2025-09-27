import { useSearchParams } from 'react-router-dom';

/**
 * Generic hook for managing boolean state in URL parameters
 * @param paramName - The URL parameter name (e.g., 'sidebar', 'modal')
 * @returns [isOpen, toggle] - Current state and toggle function
 */
export const useUrlBooleanState = (paramName: string) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const isOpen = searchParams.get(paramName) === 'true';
  
  const toggle = (isOpen?: boolean) => {
    const newState = isOpen !== undefined ? isOpen : !isOpen;
    
    if (newState) {
      setSearchParams({ [paramName]: 'true' }, { replace: true });
    } else {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete(paramName);
      setSearchParams(newParams, { replace: true });
    }
  };
  
  return [isOpen, toggle] as const;
};

/**
 * Generic hook for managing any string state in URL parameters
 * @param paramName - The URL parameter name
 * @param defaultValue - Default value when parameter is not present
 * @returns [value, setValue] - Current value and setter function
 */
export const useUrlStringState = (paramName: string, defaultValue: string = '') => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const value = searchParams.get(paramName) || defaultValue;
  
  const setValue = (newValue: string) => {
    if (newValue === defaultValue || newValue === '') {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete(paramName);
      setSearchParams(newParams, { replace: true });
    } else {
      setSearchParams({ [paramName]: newValue }, { replace: true });
    }
  };
  
  return [value, setValue] as const;
};

/**
 * Generic hook for managing array state in URL parameters (comma-separated)
 * @param paramName - The URL parameter name
 * @param defaultValue - Default array when parameter is not present
 * @returns [array, setArray] - Current array and setter function
 */
export const useUrlArrayState = (paramName: string, defaultValue: string[] = []) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const paramValue = searchParams.get(paramName);
  const array = paramValue ? paramValue.split(',') : defaultValue;
  
  const setArray = (newArray: string[]) => {
    if (newArray.length === 0) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete(paramName);
      setSearchParams(newParams, { replace: true });
    } else {
      setSearchParams({ [paramName]: newArray.join(',') }, { replace: true });
    }
  };
  
  return [array, setArray] as const;
};

