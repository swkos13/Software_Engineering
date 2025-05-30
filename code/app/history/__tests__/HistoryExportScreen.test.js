// app/history/__tests__/HistoryExportScreen.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HistoryExportScreen from '../HistoryExportScreen';

describe('HistoryExportScreen', () => {
  it('εξάγει επιτυχώς με σωστά φίλτρα και μορφή', () => {
    const { getByTestId, getByText } = render(<HistoryExportScreen />);
    fireEvent.changeText(getByTestId('start-date'), '2024-05-01');
    fireEvent.changeText(getByTestId('end-date'), '2024-05-05');
    fireEvent.press(getByTestId('type-select-Faults'));
    fireEvent.press(getByTestId('format-select-csv'));
    fireEvent.press(getByText('Εξαγωγή'));

    expect(getByText('Η εξαγωγή ολοκληρώθηκε')).toBeTruthy();
  });

  it('εμφανίζει μήνυμα όταν δεν υπάρχουν δεδομένα', () => {
    const { getByTestId, getByText } = render(<HistoryExportScreen />);
    fireEvent.changeText(getByTestId('start-date'), '2030-01-01');
    fireEvent.changeText(getByTestId('end-date'), '2030-01-05');
    fireEvent.press(getByText('Εξαγωγή'));

    expect(getByText('Δεν βρέθηκαν δεδομένα για τα φίλτρα')).toBeTruthy();
  });
});
