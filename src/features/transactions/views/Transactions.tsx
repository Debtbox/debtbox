import { useState, useMemo, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/shared/Button';
import FilterSection, {
  type FilterConfig,
} from '@/components/shared/FilterSection';
import Table, { type TableColumn } from '@/components/shared/Table';
import {
  formatCurrency,
  processDebtData,
  type SupportedLocale,
} from '../../dashboard/utils/debtUtils';
import { type DebtTableData, type Debt } from '../../dashboard/types/debt';
import { useGetMerchantDebts } from '../../dashboard/api/getMerchantDebts';
import { useUserStore } from '@/stores/UserStore';
import { ChevronDown, SaudiRiyal } from 'lucide-react';
import { toast } from '@/lib/toast';
import {
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
  const [selectedDebt, setSelectedDebt] = useState<Debt | undefined>(undefined);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const locale = i18n.language as SupportedLocale;

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
      render: (_, record) => {
        const isGrouped = !!record.isGrouped && (record.debtsCount ?? 0) > 1;
        if (!isGrouped) {
          return (
            <div className="font-medium text-gray-900">
              {record.customerName}
            </div>
          );
        }
        const isExpanded = !!expandedRows[record.debtId];
        const hasExtra =
          isExpanded && !!record.debts && record.debts.length > 0;
        const radius = hasExtra ? 'rounded-ts-sm' : 'rounded-s-sm';
        return (
          <div
            className={`-my-4 -ms-6 ps-6 py-4 border-s-2 border-s-primary/30 ${radius}`}
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
          <span>{record.title || '-'}</span>
          {record.isGrouped && (record.debtsCount ?? 0) > 1 && (
            <span className="ms-2 text-xs font-medium text-gray-500">
              (
              {t('dashboard.debtsCount', '{count} Invoices', {
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
        <div className="text-gray-900">{record.formattedDueDate}</div>
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
          <div className="min-w-50">
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
            const isExpandable =
              record.isGrouped && (record.debtsCount ?? 0) > 1;
            const isExpanded = isExpandable && !!expandedRows[record.debtId];
            if (!isExpanded || !record.debts || record.debts.length === 0) {
              return null;
            }
            return (
              <div className="-mt-3 -mb-3 -ms-6 ps-6 pt-3 pb-3 border-s-2 border-s-primary/30 rounded-bs-sm">
                <div className="w-full lg:w-1/2 rounded-md border border-gray-100 bg-gray-50/50 divide-y divide-gray-100">
                  {record.debts.map((child) => (
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
