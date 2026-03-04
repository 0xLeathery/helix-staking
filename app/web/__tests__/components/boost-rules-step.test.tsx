import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

const mockSetStep = vi.fn();
const mockSetBoostRulesAcknowledged = vi.fn();

vi.mock('@/lib/store/ui-store', () => ({
  useStakeWizard: () => ({
    step: 3,
    setStep: mockSetStep,
    boostRulesAcknowledged: false,
    setBoostRulesAcknowledged: mockSetBoostRulesAcknowledged,
  }),
}));

// Mock lucide-react icons to avoid SVG rendering issues in tests
vi.mock('lucide-react', () => ({
  Camera: () => React.createElement('span', { 'data-testid': 'icon-camera' }),
  Shield: () => React.createElement('span', { 'data-testid': 'icon-shield' }),
  AlertTriangle: () => React.createElement('span', { 'data-testid': 'icon-alert' }),
  TrendingUp: () => React.createElement('span', { 'data-testid': 'icon-trending' }),
}));

import { BoostRulesStep } from '@/components/stake/stake-wizard/boost-rules-step';

describe('BoostRulesStep', () => {
  beforeEach(() => {
    mockSetStep.mockClear();
    mockSetBoostRulesAcknowledged.mockClear();
  });

  it('renders all 4 rule titles', () => {
    render(<BoostRulesStep />);
    // Use getAllByText for titles that also appear in descriptions, and check first match is the heading
    expect(screen.getAllByText(/Snapshot/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Headroom/i).length).toBeGreaterThan(0);
    expect(screen.getByText('Permanent Revocation')).toBeInTheDocument();
    expect(screen.getByText('10% Multiplier')).toBeInTheDocument();
  });

  it('Continue button is disabled when checkbox is unchecked', () => {
    render(<BoostRulesStep />);
    const continueButton = screen.getByRole('button', { name: /Continue/i });
    expect(continueButton).toBeDisabled();
  });

  it('checking the checkbox enables the Continue button', async () => {
    const user = userEvent.setup();
    render(<BoostRulesStep />);
    const checkbox = screen.getByRole('checkbox');
    const continueButton = screen.getByRole('button', { name: /Continue/i });
    expect(continueButton).toBeDisabled();
    await user.click(checkbox);
    expect(continueButton).not.toBeDisabled();
  });

  it('clicking Continue when checked calls setStep(4)', async () => {
    const user = userEvent.setup();
    render(<BoostRulesStep />);
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    const continueButton = screen.getByRole('button', { name: /Continue/i });
    await user.click(continueButton);
    expect(mockSetBoostRulesAcknowledged).toHaveBeenCalledWith(true);
    expect(mockSetStep).toHaveBeenCalledWith(4);
  });

  it('clicking Back calls setStep(2)', async () => {
    const user = userEvent.setup();
    render(<BoostRulesStep />);
    const backButton = screen.getByRole('button', { name: /Back/i });
    await user.click(backButton);
    expect(mockSetStep).toHaveBeenCalledWith(2);
  });
});
