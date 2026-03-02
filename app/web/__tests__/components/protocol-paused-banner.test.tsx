import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ProtocolPausedBanner } from '@/components/dashboard/protocol-paused-banner';

describe('ProtocolPausedBanner', () => {
  it('renders nothing when isPaused=false', () => {
    const { container } = render(<ProtocolPausedBanner isPaused={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the banner when isPaused=true', () => {
    render(<ProtocolPausedBanner isPaused={true} />);
    expect(screen.getByText(/Protocol Paused/i)).toBeInTheDocument();
  });

  it('shows message about temporary disable when paused', () => {
    render(<ProtocolPausedBanner isPaused={true} />);
    expect(screen.getByText(/Staking, unstaking, and claiming are/i)).toBeInTheDocument();
  });

  it('does not render warning text when not paused', () => {
    render(<ProtocolPausedBanner isPaused={false} />);
    expect(screen.queryByText(/Protocol Paused/i)).not.toBeInTheDocument();
  });
});
