import { useState, useMemo, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/shared/Button';
import FilterSection, {
  type FilterConfig,
} from '@/components/shared/FilterSection';
import Table, { type TableColumn } from '@/components/shared/Table';
import { processDebtData } from '../../dashboard/utils/debtUtils';
import { type DebtTableData, type Debt } from '../../dashboard/types/debt';
import { useGetMerchantDebts } from '../../dashboard/api/getMerchantDebts';
import { useUserStore } from '@/stores/UserStore';
import { SaudiRiyal } from 'lucide-react';
import { toast } from 'sonner';
import {
  DueDateStatusBadge,
  StatusBadge,
  type StatusBadgeStatus,
} from '@/components/shared/StatusBadge';
import MultiSelectDropdown from '@/components/shared/MultiSelectDropdown';
import StatusBadges from '@/components/shared/StatusBadges';
import Sideover from '@/components/shared/Sideover';
import DebtDetails from '../../dashboard/components/DebtDetails/DebtDetails';
import NoData from '@/components/shared/NoData';

type DebtStatus = 'all' | 'normal' | 'overdue' | 'in 7 days' | 'soon';

export const Transactions = () => {
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
  const [selectedDebt, setSelectedDebt] = useState<Debt | undefined>(
    undefined,
  );

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
      toast.error(
        error.response?.data?.message || t('transactions.fetchFailed'),
      );
      setLoading(false);
    },
  });

  const refetchTransactions = useCallback(() => {
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
        isFullHistory: true, // Key difference: always true for transactions
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

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatuses]);

  useEffect(() => {
    refetchTransactions();
  }, [refetchTransactions]);

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
          <div className="font-semibold text-gray-900 flex items-center gap-1">
            <SaudiRiyal className="text-gray-900" /> {record.formattedAmount}
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
      key: 'original_date',
      title: t('dashboard.originalDueDate'),
      dataIndex: 'formattedOriginalDueDate',
      render: (_, record) => (
        <div>
          <div className="text-gray-900">{record.formattedOriginalDueDate}</div>
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
        <StatusBadge status={record.status as StatusBadgeStatus} />
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
          className="w-full md:w-32 h-10 transition-colors duration-200"
          onClick={() => {
            setSelectedDebt(record);
            setIsDetailsSideoverOpen(true);
          }}
        />
      ),
    },
  ];

  return (
    <section className="space-y-4 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('transactions.title', 'Transactions')}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {t('transactions.description', 'View all transaction history')}
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 w-full h-full hover:shadow-md transition-shadow duration-200">
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

        <Table<DebtTableData>
          columns={columns}
          data={processedData}
          loading={loading}
          rowKey="debtId"
          rowExtra={(record) => {
            const messages: { content: string; className: string }[] = [];

            // Pending/Overdue banner
            const isPending = record.isPending || record.status === 'pending';
            const isOverdue = record.isOverdue;
            if (isPending || isOverdue) {
              const pendingOverdueMessage = isPending
                ? t(
                    'dashboard.pendingBanner',
                    'This due is pending from the client',
                  )
                : t('dashboard.overdueBanner', 'This due is overdue');
              const bg = isPending ? 'bg-yellow-50' : 'bg-red-50';
              const text = isPending ? 'text-yellow-800' : 'text-red-800';
              messages.push({
                content: pendingOverdueMessage,
                className: `${bg} ${text}`,
              });
            }

            // Time extension banner
            if (
              record.original_date &&
              record.original_date !== record.due_date
            ) {
              const original = new Date(record.original_date);
              const current = new Date(record.due_date);
              if (!isNaN(original.getTime()) && !isNaN(current.getTime())) {
                const msPerDay = 1000 * 60 * 60 * 24;
                const days = Math.round(
                  (current.getTime() - original.getTime()) / msPerDay,
                );
                if (days > 0) {
                  const weeks = Math.round(days / 7);
                  const amount = weeks >= 1 ? weeks : days;
                  const unit =
                    weeks >= 1
                      ? t('dashboard.weeks', 'weeks')
                      : t('dashboard.days', 'days');
                  const oldDate = record.formattedOriginalDueDate;
                  const hasReason = record.reason && record.reason.trim();
                  const extensionMessage = hasReason
                    ? t(
                        'dashboard.dateExtendedByWithReason',
                        'This date is extended by {{amount}} {{unit}}, the old date is {{date}}. Reason: {{reason}}',
                        { amount, unit, date: oldDate, reason: record.reason },
                      )
                    : t(
                        'dashboard.dateExtendedBy',
                        'This date is extended by {{amount}} {{unit}}, the old date is {{date}}',
                        { amount, unit, date: oldDate },
                      );
                  messages.push({
                    content: extensionMessage,
                    className: 'bg-primary/5 text-primary/80',
                  });
                }
              }
            }

            if (messages.length === 0) return null;
            return (
              <div className="w-full flex flex-col gap-2">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`w-full rounded-md px-4 py-3 ${m.className}`}
                  >
                    {m.content}
                  </div>
                ))}
              </div>
            );
          }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalCount,
            onChange: handlePageChange,
            onViewAll: handleViewAll,
          }}
          showActions={false}
          emptyText={<NoData title={t('transactions.noTransactionsFound')} />}
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
              refetchDebts={refetchTransactions}
            />
          )}
        </Sideover>
      </div>
    </section>
  );
};
