import { createContext, useState } from 'react';

export const PrinterContext = createContext();

export const PrinterProvider = ({ children }) => {
  const [connectedPrinter, setConnectedPrinter] = useState(null);

  const connectPrinter = (printer) => {
    setConnectedPrinter(printer);
  };

  const disconnectPrinter = () => {
    setConnectedPrinter(null);
  };

  return (
    <PrinterContext.Provider
      value={{
        connectedPrinter,
        connectPrinter,
        disconnectPrinter,
      }}
    >
      {children}
    </PrinterContext.Provider>
  );
};

