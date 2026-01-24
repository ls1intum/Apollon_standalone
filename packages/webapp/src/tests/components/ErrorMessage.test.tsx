import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorMessage } from '../../main/components/error-handling/error-message';
import { ApollonError } from '../../main/services/error-management/errorManagementSlice';

describe('ErrorMessage', () => {
  const mockError: ApollonError = {
    id: 'test-error-id',
    headerText: 'Test Error Header',
    bodyText: 'This is the error body text',
  };

  it('should render the error header and body', () => {
    const onClose = vi.fn();

    render(<ErrorMessage error={mockError} onClose={onClose} />);

    expect(screen.getByText('Test Error Header')).toBeInTheDocument();
    expect(screen.getByText('This is the error body text')).toBeInTheDocument();
  });

  it('should render as a danger alert', () => {
    const onClose = vi.fn();

    render(<ErrorMessage error={mockError} onClose={onClose} />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('alert-danger');
  });

  it('should call onClose when dismiss button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<ErrorMessage error={mockError} onClose={onClose} />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledWith(mockError);
  });

  it('should hide the alert after clicking dismiss', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<ErrorMessage error={mockError} onClose={onClose} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
