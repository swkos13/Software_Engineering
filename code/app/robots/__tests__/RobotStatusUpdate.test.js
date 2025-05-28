// app/robots/__tests__/RobotStatusUpdate.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RobotStatusUpdate from '../RobotStatusUpdate';

describe('RobotStatusUpdate', () => {
  it('αλλάζει την κατάσταση ρομπότ επιτυχώς', () => {
    const { getByTestId, getByText } = render(<RobotStatusUpdate />);
    fireEvent.press(getByTestId('select-robot-2'));
    fireEvent.press(getByTestId('status-Λειτουργικό'));
    fireEvent.press(getByText('Ενημέρωση'));

    expect(getByText('Κατάσταση ενημερώθηκε')).toBeTruthy();
  });

  it('δεν αλλάζει όταν δεν επιλεγεί νέα κατάσταση', () => {
    const { getByText } = render(<RobotStatusUpdate />);
    fireEvent.press(getByText('Ενημέρωση'));
    expect(getByText('Επιλέξτε νέα κατάσταση')).toBeTruthy();
  });
});
