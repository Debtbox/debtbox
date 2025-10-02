import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/shared/Button';
import FilterSection, {
  type FilterConfig,
} from '@/components/shared/FilterSection';
import Table, { type TableColumn } from '@/components/shared/Table';
import { processDebtData, filterDebts, sortDebts } from '../../utils/debtUtils';
import { type DebtTableData, type Debt } from '../../types/debt';
import { useGetMerchantDebts } from '../../api/getMerchantDebts';
import { useUserStore } from '@/stores/UserStore';
import { Eye } from 'lucide-react';
import { toast } from 'sonner';
import {
  DueDateStatusBadge,
  StatusBadge,
} from '@/components/shared/StatusBadge';

type DebtStatus = 'all' | 'normal' | 'overdue' | 'almost' | 'soon';

const DebtsTable = ({ isSideoverOpen }: { isSideoverOpen: boolean }) => {
  const { t, i18n } = useTranslation();
  const { selectedBusiness } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<DebtStatus>('all');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({ key: 'dueDate', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { value: 'all', label: t('common.buttons.allStatuses') },
    { value: 'normal', label: t('common.buttons.normal') },
    { value: 'overdue', label: t('common.buttons.overdue') },
    { value: 'almost', label: t('common.buttons.almost') },
    { value: 'soon', label: t('common.buttons.soon') },
  ];

  const handleSearchClear = () => {
    setSearchTerm('');
  };

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortConfig({ key, direction });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // API integration
  const { mutate: getMerchantDebts } = useGetMerchantDebts({
    onSuccess: (data) => {
      if (data.success && Array.isArray(data.data)) {
        setDebts(data.data);
      } else {
        setDebts([]);
      }
      setLoading(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to fetch debts');
      setLoading(false);
    },
  });

  // Fetch debts when component mounts or filters change
  useEffect(() => {
    if (selectedBusiness) {
      setLoading(true);
      getMerchantDebts({
        businessId: selectedBusiness.id.toString(),
        pageIndex: currentPage - 1,
        pageSize,
        customerName: searchTerm || undefined,
        debtDateStatus: selectedStatus !== 'all' ? selectedStatus : undefined,
      });
    }
  }, [
    selectedBusiness,
    currentPage,
    searchTerm,
    selectedStatus,
    getMerchantDebts,
    pageSize,
    isSideoverOpen,
  ]);

  // Process and filter data
  const processedData = useMemo(() => {
    const filtered = filterDebts(
      debts,
      {
        search: searchTerm,
        status: selectedStatus,
      },
      i18n.language,
    );

    const sorted = sortDebts(filtered, sortConfig.key, sortConfig.direction);

    return sorted.map((debt) => processDebtData(debt, i18n.language));
  }, [debts, searchTerm, selectedStatus, sortConfig, i18n.language]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return processedData.slice(startIndex, startIndex + pageSize);
  }, [processedData, currentPage, pageSize]);

  const filterConfig: FilterConfig = {
    search: {
      placeholder: t('common.buttons.search'),
      value: searchTerm,
      onChange: setSearchTerm,
      onClear: handleSearchClear,
      showClearButton: true,
    },
    dropdowns: [
      {
        key: 'status',
        options: statusOptions,
        value: selectedStatus,
        onChange: (value) => setSelectedStatus(value as DebtStatus),
        placeholder: t('common.buttons.selectStatus'),
      },
    ],
  };

  // Table columns
  const columns: TableColumn<DebtTableData>[] = [
    {
      key: 'customer',
      title: t('common.buttons.customer'),
      dataIndex: 'customerName',
      render: (_, record) => (
        <div>
          <div className="font-medium text-gray-900">{record.customerName}</div>
        </div>
      ),
    },
    {
      key: 'amount',
      title: t('common.buttons.amount'),
      dataIndex: 'amount',
      render: (_, record) => (
        <div className="text-start">
          <div className="font-semibold text-gray-900">
            {record.formattedAmount}
          </div>
        </div>
      ),
    },
    {
      key: 'due_date',
      title: t('common.buttons.dueDate'),
      dataIndex: 'formattedDueDate',
      render: (_, record) => (
        <div>
          <div className="text-gray-900">{record.formattedDueDate}</div>
          <div className="text-sm text-gray-500">
            {record.daysUntilDue > 0
              ? `${record.daysUntilDue} ${t('common.buttons.daysLeft')}`
              : record.daysUntilDue === 0
                ? t('common.buttons.dueToday')
                : `${Math.abs(record.daysUntilDue)} ${t('common.buttons.daysOverdue')}`}
          </div>
        </div>
      ),
    },
    {
      key: 'dueDateStatus',
      title: t('dashboard.dueDateStatus'),
      dataIndex: 'dueDateStatus',
      render: (_, record) => (
        <DueDateStatusBadge
          status={
            record.dueDateStatus as 'normal' | 'overdue' | 'almost' | 'soon'
          }
        />
      ),
    },
    {
      key: 'status',
      title: t('common.buttons.status'),
      dataIndex: 'status',
      render: (_, record) => (
        <StatusBadge status={record.status as 'pending' | 'paid' | 'expired'} />
      ),
    },
  ];

  const handleRowAction = (action: string, record: DebtTableData) => {
    console.log(`${action} clicked for debt:`, record.debtId);
    // Implement action handlers here
  };

  const renderActions = (record: DebtTableData) => (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleRowAction('view', record)}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        title={t('common.buttons.viewDetails')}
      >
        <Eye className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl p-6 w-full h-full">
      <FilterSection
        config={filterConfig}
        variant="default"
        showBorder={false}
        actions={
          <Button
            text={t('common.buttons.export')}
            variant="secondary"
            disabled
            className="w-full md:w-44 h-12"
          />
        }
      />

      {/* Table */}
      <Table
        columns={columns}
        data={paginatedData}
        loading={loading}
        rowKey="debtId"
        sortConfig={{
          key: sortConfig.key,
          direction: sortConfig.direction,
          onChange: handleSort,
        }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: processedData.length,
          onChange: handlePageChange,
        }}
        actions={renderActions}
        showActions={true}
        emptyText={t('common.buttons.noDebtsFound')}
        className="border-0"
      />
    </div>
  );
};

export default DebtsTable;
