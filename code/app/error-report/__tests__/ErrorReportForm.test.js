// app/error-report/__tests__/ErrorReportForm.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ErrorReportForm from '../ErrorReportForm';

describe('ErrorReportForm', () => {
  it('υποβάλλει επιτυχώς με έγκυρα δεδομένα', () => {
    const { getByTestId, getByText } = render(<ErrorReportForm />);
    fireEvent.press(getByTestId('robot-select-1'));
    fireEvent.press(getByTestId('error-type-Communication'));
    fireEvent.changeText(getByTestId('description-input'), 'Το ρομπότ δεν απαντά.');
    fireEvent.press(getByText('Υποβολή'));

    expect(getByText('Η αναφορά καταχωρήθηκε')).toBeTruthy();
  });

  it('αποτυγχάνει όταν λείπει η περιγραφή', () => {
    const { getByTestId, getByText } = render(<ErrorReportForm />);
    fireEvent.press(getByTestId('robot-select-1'));
    fireEvent.press(getByTestId('error-type-Movement'));
    fireEvent.press(getByText('Υποβολή'));

    expect(getByText('Η περιγραφή είναι υποχρεωτική')).toBeTruthy();
  });
});
