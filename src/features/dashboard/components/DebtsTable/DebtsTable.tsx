import { useState, useMemo, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/shared/Button';
import FilterSection, {
  type FilterConfig,
} from '@/components/shared/FilterSection';
import Table, { type TableColumn } from '@/components/shared/Table';
import { processDebtData } from '../../utils/debtUtils';
import { type DebtTableData, type Debt } from '../../types/debt';
import { useGetMerchantDebts } from '../../api/getMerchantDebts';
import { useUserStore } from '@/stores/UserStore';
// import { Eye } from 'lucide-react';
import { toast } from 'sonner';
import {
  DueDateStatusBadge,
  StatusBadge,
} from '@/components/shared/StatusBadge';
import MultiSelectDropdown from '@/components/shared/MultiSelectDropdown';
import StatusBadges from '@/components/shared/StatusBadges';
import Sideover from '@/components/shared/Sideover';
import DebtDetails from '../DebtDetails/DebtDetails';

type DebtStatus = 'all' | 'normal' | 'overdue' | 'in 7 days' | 'soon';

const DebtsTable = ({ isSideoverOpen }: { isSideoverOpen: boolean }) => {
  const { t, i18n } = useTranslation();
  const { selectedBusiness } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<DebtStatus[]>([
    'all',
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isViewAll, setIsViewAll] = useState(false);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isDetailsSideoverOpen, setIsDetailsSideoverOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<Debt | undefined>(undefined);

  const statusOptions = [
    { value: 'normal', label: t('common.buttons.normal') },
    { value: 'overdue', label: t('common.buttons.overdue') },
    { value: 'in 7 days', label: t('common.buttons.in7days') },
    { value: 'soon', label: t('common.buttons.soon') },
  ];

  const handleSearchClear = () => {
    setSearchTerm('');
  };

  const handlePageChange = (page: number, newPageSize?: number) => {
    setCurrentPage(page);
    if (newPageSize && newPageSize !== pageSize) {
      setPageSize(newPageSize);
    }
  };

  const handleViewAll = () => {
    setIsViewAll(true);
    setPageSize(totalCount);
    setCurrentPage(1);
  };

  const { mutate: getMerchantDebts } = useGetMerchantDebts({
    onSuccess: ({ data, success }) => {
      if (data.data.length > 0 && success) {
        setDebts(data.data);
        setTotalCount(data.count);
      } else {
        setDebts([]);
        setTotalCount(0);
      }
      setLoading(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to fetch debts');
      setLoading(false);
    },
  });

  const refetchDebts = useCallback(() => {
    if (selectedBusiness) {
      setLoading(true);
      getMerchantDebts({
        businessId: selectedBusiness.id.toString(),
        pageIndex: currentPage - 1,
        pageSize: isViewAll ? totalCount : pageSize,
        customerName: searchTerm || undefined,
        debtDueStatus: selectedStatuses.includes('all')
          ? undefined
          : (selectedStatuses.filter((status) => status !== 'all') as (
              | 'normal'
              | 'overdue'
              | 'in 7 days'
              | 'soon'
            )[]),
      });
    }
  }, [
    selectedBusiness,
    currentPage,
    pageSize,
    isViewAll,
    totalCount,
    searchTerm,
    selectedStatuses,
    getMerchantDebts,
  ]);

  useEffect(() => {
    refetchDebts();
  }, [refetchDebts, isSideoverOpen]);

  const processedData = useMemo(() => {
    return debts.map((debt) => processDebtData(debt, i18n.language));
  }, [debts, i18n.language]);

  const filterConfig: FilterConfig = {
    search: {
      placeholder: t('common.buttons.search'),
      value: searchTerm,
      onChange: setSearchTerm,
      onClear: handleSearchClear,
      showClearButton: true,
    },
  };

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
      key: 'title',
      title: t('dashboard.debt_title'),
      dataIndex: 'title',
      render: (_, record) => (
        <div className="text-gray-900">{record.title || '-'}</div>
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
            record.dueDateStatus as 'normal' | 'overdue' | 'in 7 days' | 'soon'
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
    {
      key: 'actions',
      title: t('common.buttons.actions'),
      dataIndex: 'actions',
      render: (_, record) => (
        <Button
          text={t('common.buttons.view')}
          variant="gray"
          className="w-full md:w-32 h-10"
          onClick={() => {
            setSelectedDebt(record);
            setIsDetailsSideoverOpen(true);
          }}
        />
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 w-full h-full">
      <FilterSection
        config={filterConfig}
        variant="default"
        showBorder={false}
        actions={
          <Button
            text={t('common.buttons.export')}
            variant="gray"
            disabled
            className="w-full md:w-44 h-12"
          />
        }
      >
        <div className="min-w-[200px]">
          <MultiSelectDropdown
            options={statusOptions}
            values={selectedStatuses.filter((status) => status !== 'all')}
            onChange={(values) => {
              const newStatuses: DebtStatus[] =
                values.length === 0 ? ['all'] : (values as DebtStatus[]);
              setSelectedStatuses(newStatuses);
            }}
            placeholder={t('common.buttons.selectStatus')}
            className="w-full"
          />
        </div>
      </FilterSection>

      <div className="mb-4">
        <StatusBadges
          selectedStatuses={selectedStatuses.filter(
            (status) => status !== 'all',
          )}
          onRemove={(status) => {
            const newStatuses = selectedStatuses.filter((s) => s !== status);
            setSelectedStatuses(
              newStatuses.length === 0 ? ['all'] : newStatuses,
            );
          }}
          statusOptions={statusOptions}
        />
      </div>

      <Table
        columns={columns}
        data={processedData}
        loading={loading}
        rowKey="debtId"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalCount,
          onChange: handlePageChange,
          onViewAll: handleViewAll,
        }}
        showActions={false}
        emptyText={t('common.buttons.noDebtsFound')}
        className="border-0"
      />

      <Sideover
        isOpen={isDetailsSideoverOpen}
        onClose={() => setIsDetailsSideoverOpen(false)}
        title={t('common.buttons.viewDetails')}
        className="flex flex-col h-full"
        hasPadding={false}
        direction={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      >
        {selectedDebt && (
          <DebtDetails
            debtData={selectedDebt as Debt}
            setIsSideoverOpen={setIsDetailsSideoverOpen}
            refetchDebts={refetchDebts}
          />
        )}
      </Sideover>
    </div>
  );
};

export default DebtsTable;
