// app/scheduling/__tests__/CreateTaskForm.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CreateTaskForm from '../CreateTaskForm';

describe('CreateTaskForm', () => {
  it('επιτυχής υποβολή με έγκυρα δεδομένα', () => {
    const { getByPlaceholderText, getByText } = render(<CreateTaskForm />);
    fireEvent.changeText(getByPlaceholderText('Περιγραφή'), 'Μεταφορά δοχείου');
    fireEvent.changeText(getByPlaceholderText('Κατηγορία'), 'Μεταφορά');
    fireEvent.press(getByText('Καταχώρηση'));
    expect(getByText('Η εργασία καταχωρήθηκε επιτυχώς')).toBeTruthy();
  });

  it('αποτυγχάνει χωρίς περιγραφή', () => {
    const { getByText } = render(<CreateTaskForm />);
    fireEvent.press(getByText('Καταχώρηση'));
    expect(getByText('Η περιγραφή είναι υποχρεωτική')).toBeTruthy();
  });
});
