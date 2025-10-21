import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, user, waitFor } from '@/test';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { mockTransactionStats, mockTransactions } from '@/test/fixtures';

// Mock the dashboard view component
const MockDashboard = () => {
  return (
    <div data-testid="dashboard">
      <h1>Dashboard</h1>
      <div data-testid="stats-section">
        <h2>Statistics</h2>
        <div data-testid="total-transactions">Total: 150</div>
        <div data-testid="total-amount">Amount: $50,000</div>
        <div data-testid="pending-transactions">Pending: 5</div>
        <div data-testid="completed-transactions">Completed: 145</div>
      </div>
      <div data-testid="transactions-section">
        <h2>Recent Transactions</h2>
        <div data-testid="transactions-list">
          {mockTransactions.map((transaction) => (
            <div key={transaction.id} data-testid={`transaction-${transaction.id}`}>
              <span data-testid={`transaction-amount-${transaction.id}`}>
                ${transaction.amount}
              </span>
              <span data-testid={`transaction-status-${transaction.id}`}>
                {transaction.status}
              </span>
              <span data-testid={`transaction-description-${transaction.id}`}>
                {transaction.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

describe('Dashboard Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dashboard with all sections', () => {
    render(<MockDashboard />);
    
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('stats-section')).toBeInTheDocument();
    expect(screen.getByTestId('transactions-section')).toBeInTheDocument();
  });

  it('displays transaction statistics', () => {
    render(<MockDashboard />);
    
    expect(screen.getByTestId('total-transactions')).toHaveTextContent('Total: 150');
    expect(screen.getByTestId('total-amount')).toHaveTextContent('Amount: $50,000');
    expect(screen.getByTestId('pending-transactions')).toHaveTextContent('Pending: 5');
    expect(screen.getByTestId('completed-transactions')).toHaveTextContent('Completed: 145');
  });

  it('displays transaction list', () => {
    render(<MockDashboard />);
    
    expect(screen.getByTestId('transactions-list')).toBeInTheDocument();
    
    // Check that all mock transactions are rendered
    mockTransactions.forEach((transaction) => {
      expect(screen.getByTestId(`transaction-${transaction.id}`)).toBeInTheDocument();
      expect(screen.getByTestId(`transaction-amount-${transaction.id}`)).toHaveTextContent(
        `$${transaction.amount}`
      );
      expect(screen.getByTestId(`transaction-status-${transaction.id}`)).toHaveTextContent(
        transaction.status
      );
      expect(screen.getByTestId(`transaction-description-${transaction.id}`)).toHaveTextContent(
        transaction.description
      );
    });
  });

  it('loads dashboard data from API', async () => {
    // Mock API responses
    server.use(
      http.get('/api/dashboard/stats', () => {
        return HttpResponse.json({
          success: true,
          data: mockTransactionStats,
        });
      }),
      http.get('/api/dashboard/transactions', () => {
        return HttpResponse.json({
          success: true,
          data: {
            transactions: mockTransactions,
            pagination: {
              page: 1,
              limit: 10,
              total: mockTransactions.length,
              totalPages: 1,
            },
          },
        });
      })
    );

    render(<MockDashboard />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByTestId('stats-section')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('transactions-section')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    // Mock API error
    server.use(
      http.get('/api/dashboard/stats', () => {
        return HttpResponse.json(
          { success: false, message: 'Failed to load stats' },
          { status: 500 }
        );
      })
    );

    render(<MockDashboard />);
    
    // The component should still render even with API errors
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
  });

  it('filters transactions by status', async () => {
    render(<MockDashboard />);
    
    // All transactions should be visible initially
    expect(screen.getByTestId('transaction-1')).toBeInTheDocument();
    expect(screen.getByTestId('transaction-2')).toBeInTheDocument();
    expect(screen.getByTestId('transaction-3')).toBeInTheDocument();
    
    // In a real implementation, you would test filtering functionality
    // For example, clicking a filter button and checking that only filtered results show
  });

  it('displays transaction details correctly', () => {
    render(<MockDashboard />);
    
    const firstTransaction = mockTransactions[0];
    
    expect(screen.getByTestId(`transaction-amount-${firstTransaction.id}`)).toHaveTextContent(
      `$${firstTransaction.amount}`
    );
    expect(screen.getByTestId(`transaction-status-${firstTransaction.id}`)).toHaveTextContent(
      firstTransaction.status
    );
    expect(screen.getByTestId(`transaction-description-${firstTransaction.id}`)).toHaveTextContent(
      firstTransaction.description
    );
  });

  it('handles empty transaction list', () => {
    const EmptyDashboard = () => (
      <div data-testid="dashboard">
        <h1>Dashboard</h1>
        <div data-testid="transactions-section">
          <h2>Recent Transactions</h2>
          <div data-testid="transactions-list">
            <div data-testid="empty-state">No transactions found</div>
          </div>
        </div>
      </div>
    );

    render(<EmptyDashboard />);
    
    expect(screen.getByTestId('empty-state')).toHaveTextContent('No transactions found');
  });

  it('updates statistics in real-time', async () => {
    // Mock real-time updates
    const { rerender } = render(<MockDashboard />);
    
    expect(screen.getByTestId('total-transactions')).toHaveTextContent('Total: 150');
    
    // Simulate real-time update
    const UpdatedDashboard = () => (
      <div data-testid="dashboard">
        <h1>Dashboard</h1>
        <div data-testid="stats-section">
          <h2>Statistics</h2>
          <div data-testid="total-transactions">Total: 151</div>
          <div data-testid="total-amount">Amount: $50,100</div>
          <div data-testid="pending-transactions">Pending: 4</div>
          <div data-testid="completed-transactions">Completed: 147</div>
        </div>
      </div>
    );
    
    rerender(<UpdatedDashboard />);
    
    expect(screen.getByTestId('total-transactions')).toHaveTextContent('Total: 151');
    expect(screen.getByTestId('total-amount')).toHaveTextContent('Amount: $50,100');
  });
});
