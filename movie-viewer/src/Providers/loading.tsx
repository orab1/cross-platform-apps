
import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';

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

    let loadingSequence = 1;

    useEffect(() => {
        setIsLoading(Object.keys(loadings).length > 0);
    }, [loadings]);

    const startLoading = () => {
        setLoadings(lastLoadings => ({ ...lastLoadings, [loadingSequence]: loadingSequence }));
        return loadingSequence++;
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