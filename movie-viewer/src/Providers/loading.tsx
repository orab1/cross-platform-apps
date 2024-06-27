
import { createContext, FC, ReactNode, useContext, useEffect, useRef, useState } from 'react';

interface LoadingContextType {
    startLoading: () => number;
    endLoading: (id: number) => void;
    isLoading: boolean;
}

export const LoadingContext = createContext<LoadingContextType>({
    startLoading: () => 0,
    endLoading: (id: number) => { },
    isLoading: false,
});

export const LoadingProvider: FC<{ children: ReactNode | ReactNode[] }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [loadings, setLoadings] = useState<Record<number, number>>({});
    const loadingSequence = useRef<number>(1);

    useEffect(() => {
        setIsLoading(() => Object.keys(loadings).length > 0);
    }, [loadings]);

    const startLoading = () => {
        const id = loadingSequence.current;
        setLoadings(lastLoadings => {
            loadingSequence.current++;
            return ({ ...lastLoadings, [id]: id })
        });

        return id;
    };

    const endLoading = (id: number) =>
        setLoadings(lastLoadings => {
            const { [id]: _, ...newLoadings } = lastLoadings;
            return newLoadings;
        });

    return (
        <LoadingContext.Provider value={{ startLoading, endLoading, isLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);