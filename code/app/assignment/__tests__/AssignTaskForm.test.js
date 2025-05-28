// app/assignment/__tests__/AssignTaskForm.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AssignTaskForm from '../AssignTaskForm';

describe('AssignTaskForm', () => {
  it('αναθέτει εργασία σε διαθέσιμο ρομπότ', () => {
    const { getByTestId, getByText } = render(<AssignTaskForm />);
    fireEvent.press(getByTestId('select-task-0'));
    fireEvent.press(getByTestId('select-robot-1'));
    fireEvent.press(getByText('Ανάθεση'));

    expect(getByText('Ανάθεση επιτυχής')).toBeTruthy();
  });

  it('δείχνει σφάλμα όταν δεν επιλεγεί ρομπότ', () => {
    const { getByText } = render(<AssignTaskForm />);
    fireEvent.press(getByText('Ανάθεση'));
    expect(getByText('Παρακαλώ επιλέξτε ρομπότ')).toBeTruthy();
  });
});