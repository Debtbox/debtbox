import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/shared/Button';
import FilterSection, {
  type FilterConfig,
} from '@/components/shared/FilterSection';
import Table, { type TableColumn } from '@/components/shared/Table';
import {
  processDebtData,
  formatCurrency,
  type SupportedLocale,
} from '../../utils/debtUtils';
import { type DebtTableData, type Debt } from '../../types/debt';
import { useGetMerchantDebts } from '../../api/getMerchantDebts';
import { useUserStore } from '@/stores/UserStore';
import { ChevronDown, SaudiRiyal } from 'lucide-react';
import { toast } from '@/lib/toast';
import {
  DueDateStatusBadge,
  StatusBadge,
  type StatusBadgeStatus,
} from '@/components/shared/StatusBadge';
import MultiSelectDropdown from '@/components/shared/MultiSelectDropdown';
import StatusBadges from '@/components/shared/StatusBadges';
import Sideover from '@/components/shared/Sideover';
import DebtDetails from '../DebtDetails/DebtDetails';
import NoData from '@/components/shared/NoData';

type DebtStatus = 'all' | 'normal' | 'overdue' | 'in 7 days' | 'soon';

const statusBorderColor: Record<string, string> = {
  cancelled: '#4F5154',
  paid: '#22C55E',
  overdue: '#FF4757',
  active: '#0E1F80',
  pending: '#F8AC1F',
  expired: '#FF4757',
};

const getStatusBorderColor = (status: string) =>
  statusBorderColor[status] ?? '#4F5154';

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
  const totalCountRef = useRef(0);
  totalCountRef.current = totalCount;
  const [loading, setLoading] = useState(false);
  const [isDetailsSideoverOpen, setIsDetailsSideoverOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<Debt | undefined>(undefined);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const hasRowExtraBelow = (record: Debt): boolean => {
    const isExpandable =
      !!record.isGrouped && (record.debtsCount ?? 0) > 1;
    const isExpanded = isExpandable && !!expandedRows[record.debtId];
    const hasChildren =
      isExpanded && !!record.debts && record.debts.length > 0;
    const hasPending =
      record.isPending || record.status === 'pending' || record.isOverdue;
    const hasExtension =
      !!record.original_date && record.original_date !== record.due_date;
    return hasChildren || hasPending || hasExtension;
  };

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
        pageSize: isViewAll ? totalCountRef.current : pageSize,
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
    searchTerm,
    selectedStatuses,
    getMerchantDebts,
  ]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatuses]);

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
      render: (_, record) => {
        const isGrouped =
          !!record.isGrouped && (record.debtsCount ?? 0) > 1;
        if (!isGrouped) {
          return (
            <div className="font-medium text-gray-900">
              {record.customerName}
            </div>
          );
        }
        const radius = hasRowExtraBelow(record)
          ? 'rounded-ts-sm'
          : 'rounded-s-sm';
        return (
          <div
            className={`-my-4 -ms-6 ps-6 py-4 border-s-2 ${radius}`}
            style={{ borderColor: getStatusBorderColor(record.status) }}
          >
            <div className="font-medium text-gray-900">
              {record.customerName}
            </div>
          </div>
        );
      },
    },
    {
      key: 'title',
      title: t('dashboard.debt_title'),
      dataIndex: 'title',
      render: (_, record) => (
        <div className="text-gray-900">
          {record.isGrouped && (record.debtsCount ?? 0) > 1 ? null : (
            <span>{record.title || '-'}</span>
          )}
          {record.isGrouped && (record.debtsCount ?? 0) > 1 && (
            <span className="ms-2 text-xs font-medium text-gray-500">
              (
              {t('dashboard.debtsCount', '{count} Debts', {
                count: record.debtsCount,
              })}
              )
            </span>
          )}
        </div>
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
      headerClassName: 'justify-center',
      render: (_, record) => {
        const isExpandable = record.isGrouped && (record.debtsCount ?? 0) > 1;
        const isExpanded = !!expandedRows[record.debtId];
        return (
          <div className="flex items-center justify-end gap-2">
            {isExpandable && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedRows((prev) => ({
                    ...prev,
                    [record.debtId]: !prev[record.debtId],
                  }));
                }}
                aria-label={t('dashboard.toggleInvoices', 'Toggle invoices')}
                className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>
            )}
            <Button
              text={t('common.buttons.view')}
              variant="gray"
              className="w-full md:w-32 h-10 transition-colors duration-200"
              onClick={() => {
                setSelectedDebt(record);
                setIsDetailsSideoverOpen(true);
              }}
            />
          </div>
        );
      },
    },
  ];

  const locale = i18n.language as SupportedLocale;

  return (
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

          // Grouped child invoices
          const isExpandable = record.isGrouped && (record.debtsCount ?? 0) > 1;
          const isExpanded = isExpandable && !!expandedRows[record.debtId];
          const children =
            isExpanded && record.debts && record.debts.length > 0
              ? record.debts
              : [];

          if (messages.length === 0 && children.length === 0) return null;

          const groupedBorderClass = isExpandable
            ? '-mt-3 -mb-3 -ms-6 ps-6 pt-3 pb-3 border-s-2 rounded-bs-sm'
            : '';

          return (
            <div
              className={`w-full flex flex-col gap-2 ${groupedBorderClass}`}
              style={
                isExpandable
                  ? { borderColor: getStatusBorderColor(record.status) }
                  : undefined
              }
            >
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`w-full rounded-md px-4 py-3 ${m.className}`}
                >
                  {m.content}
                </div>
              ))}
              {children.length > 0 && (
                <div className="w-full lg:w-1/2 rounded-md border border-gray-100 bg-gray-50/50 divide-y divide-gray-100">
                  {children.map((child) => (
                    <div
                      key={child.debtId}
                      className="flex items-center justify-between gap-4 px-4 py-3"
                    >
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wide text-gray-400">
                          {t('dashboard.invoicePrefix', 'INV')}-{child.debtId}
                        </span>
                        <span className="text-sm text-gray-800">
                          {child.title || record.title || '-'}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                        {formatCurrency(child.amount, locale)}
                        <SaudiRiyal className="text-gray-900 w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
        emptyText={<NoData title={t('common.buttons.noDebtsFound')} />}
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
