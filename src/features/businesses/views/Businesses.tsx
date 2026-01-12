import Button from '@/components/shared/Button';
import BusinessCard from '../components/BusinessCard';
import { useGetMerchantBusinesses } from '../api/getMerchantBusinesses';
import { useTranslation } from 'react-i18next';
import { useRegisterBusinesses } from '@/features/auth';
import { toast } from 'sonner';
import { useState } from 'react';
import Sideover from '@/components/shared/Sideover';
import { useUserStore } from '@/stores/UserStore';
import { useQueryClient } from '@tanstack/react-query';
import BusinessForm from '../components/BusinessForm';
import PayoutMethodSelection from '../components/PayoutMethodSelection';
import {
  validateBusinessForm,
  type NewBusiness,
} from '../utils/businessFormUtils';
import { useEditBusiness } from '../api/editBusiness';
import { useDeleteBusiness } from '../api/deleteBusiness';
import type { BusinessDto } from '@/types/BusinessDto';
import ConfirmationPopup from '@/components/shared/ConfirmationPopup';
import { AlertTriangle } from 'lucide-react';

const BusinessCardSkeleton = () => {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="h-3 w-24 bg-gray-200 rounded"></div>
          <div className="h-6 sm:h-8 w-full sm:w-48 bg-gray-200 rounded"></div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="h-12 w-full sm:w-40 md:w-52 bg-gray-200 rounded-lg"></div>
          <div className="h-12 w-full sm:w-40 md:w-52 bg-gray-200 rounded-lg"></div>
          <div className="h-12 w-full sm:w-40 md:w-52 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-3 w-full sm:w-32 bg-gray-200 rounded"></div>
            <div className="h-4 sm:h-6 w-full sm:w-24 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Businesses = () => {
  const { t, i18n } = useTranslation();
  const { user } = useUserStore();
  const queryClient = useQueryClient();
  const [isCreateBusinessModalOpen, setIsCreateBusinessModalOpen] =
    useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBusinessId, setEditingBusinessId] = useState<string | null>(
    null,
  );
  const [formStep, setFormStep] = useState<1 | 2>(1);
  const [newBusiness, setNewBusiness] = useState<NewBusiness>({
    business_name_en: '',
    business_name_ar: '',
    cr_number: '',
    city: '',
    activity: '',
    payoutMethod: 'weekly',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    business: BusinessDto | null;
  }>({
    isOpen: false,
    business: null,
  });

  const { data: businesses, isLoading } = useGetMerchantBusinesses({
    config: {
      enabled: true,
    },
  });

  const { mutate: registerBusinesses, isPending } = useRegisterBusinesses({
    onSuccess: () => {
      toast.success(
        t('businesses.businessAdded') || 'Business added successfully',
      );
      setIsCreateBusinessModalOpen(false);
      resetForm();
      // Refresh the businesses list
      queryClient.invalidateQueries({ queryKey: ['merchant-businesses'] });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || 'Business registration failed',
      );
    },
  });

  const { mutate: editBusiness, isPending: isEditing } = useEditBusiness({
    onSuccess: () => {
      toast.success(
        t('businesses.businessUpdated') || 'Business updated successfully',
      );
      setIsCreateBusinessModalOpen(false);
      resetForm();
      // Refresh the businesses list
      queryClient.invalidateQueries({ queryKey: ['merchant-businesses'] });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || 'Business update failed',
      );
    },
  });

  const { mutate: deleteBusiness, isPending: isDeleting } = useDeleteBusiness({
    onSuccess: async () => {
      toast.success(
        t('businesses.businessDeleted') || 'Business deleted successfully',
      );
      setDeleteConfirmation({ isOpen: false, business: null });
      // Refresh the businesses list
      await queryClient.invalidateQueries({
        queryKey: ['merchant-businesses'],
      });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || 'Business deletion failed',
      );
    },
  });

  const handleUpdateBusiness = (updates: Partial<NewBusiness>) => {
    setNewBusiness((prev) => ({ ...prev, ...updates }));
  };

  const handleNextStep = () => {
    const errors = validateBusinessForm(newBusiness, t, isEditMode);
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      if (isEditMode) {
        // In edit mode, submit directly without going to step 2
        handleEditSubmit();
      } else {
        // In create mode, go to step 2 (payout method)
        setFormStep(2);
      }
    }
  };

  const handleEditSubmit = () => {
    if (!user?.accessToken || !editingBusinessId) {
      toast.error('Authentication required');
      return;
    }

    editBusiness({
      id: editingBusinessId,
      businessNameEn: newBusiness.business_name_en,
      businessNameAr: newBusiness.business_name_ar,
      crNumber: newBusiness.cr_number,
      city: newBusiness.city,
      activity: newBusiness.activity,
      payoutMethod: newBusiness.payoutMethod,
      accessToken: user.accessToken,
    });
  };

  const handleBackStep = () => {
    setFormStep(1);
    setFormErrors({});
  };

  const handleSubmit = () => {
    if (!user?.accessToken) {
      toast.error('Authentication required');
      return;
    }

    registerBusinesses({
      accessToken: user.accessToken,
      businesses: [
        {
          cr_number: newBusiness.cr_number,
          business_name_en: newBusiness.business_name_en,
          business_name_ar: newBusiness.business_name_ar,
          activity: newBusiness.activity,
          city: newBusiness.city,
        },
      ],
      payoutMethod: newBusiness.payoutMethod,
    });
  };

  const handleClose = () => {
    setIsCreateBusinessModalOpen(false);
    setIsEditMode(false);
    setEditingBusinessId(null);
    resetForm();
  };

  const resetForm = () => {
    setFormStep(1);
    setNewBusiness({
      business_name_en: '',
      business_name_ar: '',
      cr_number: '',
      city: '',
      activity: '',
      payoutMethod: 'weekly',
    });
    setFormErrors({});
  };

  const handleEditBusiness = (business: BusinessDto) => {
    setIsEditMode(true);
    setEditingBusinessId(business.id.toString());
    setNewBusiness({
      business_name_en: business.business_name_en || '',
      business_name_ar: business.business_name_ar || '',
      cr_number: business.cr_number || '',
      city: business.city || '',
      activity: business.activity || '',
      payoutMethod: 'weekly', // Not editable via API
    });
    setIsCreateBusinessModalOpen(true);
    setFormStep(1);
  };

  const handleDeleteBusiness = (business: BusinessDto) => {
    setDeleteConfirmation({ isOpen: true, business });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmation.business) {
      deleteBusiness({ businessId: deleteConfirmation.business.id.toString() });
    }
  };

  const handleCloseDeleteConfirmation = () => {
    setDeleteConfirmation({ isOpen: false, business: null });
  };

  return (
    <>
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">
            {t('businesses.title')}
          </h1>
          <Button
            text={t('businesses.addBusiness')}
            variant="primary"
            className="h-12 w-full sm:w-auto sm:min-w-52"
            onClick={() => setIsCreateBusinessModalOpen(true)}
          />
        </div>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <BusinessCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {businesses?.data.map((business, index) => (
              <div
                key={business.id}
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both',
                }}
              >
                <BusinessCard
                  business={business}
                  onEdit={handleEditBusiness}
                  onDelete={handleDeleteBusiness}
                />
              </div>
            ))}
          </div>
        )}
      </section>
      <Sideover
        isOpen={isCreateBusinessModalOpen}
        onClose={handleClose}
        title={
          isEditMode
            ? t('businesses.editBusiness') || 'Edit Business'
            : t('businesses.addBusiness')
        }
        direction={i18n.language === 'ar' ? 'rtl' : 'ltr'}
        className="flex flex-col h-full"
      >
        <div className="flex flex-col gap-4 flex-1 overflow-y-auto h-full w-full p-1">
          {formStep === 1 ? (
            <BusinessForm
              newBusiness={newBusiness}
              setNewBusiness={handleUpdateBusiness}
              formErrors={formErrors}
              language={i18n.language}
              handleNextStep={handleNextStep}
              handleClose={handleClose}
              isEditMode={isEditMode}
              isLoading={isEditing}
            />
          ) : (
            <PayoutMethodSelection
              payoutMethod={newBusiness.payoutMethod}
              onPayoutMethodChange={(method) =>
                handleUpdateBusiness({ payoutMethod: method })
              }
              onBack={handleBackStep}
              onSubmit={handleSubmit}
              isLoading={isPending}
            />
          )}
        </div>
      </Sideover>
      <ConfirmationPopup
        isOpen={deleteConfirmation.isOpen}
        onClose={handleCloseDeleteConfirmation}
        onConfirm={handleConfirmDelete}
        title={t('businesses.deleteConfirmationTitle') || 'Delete Business'}
        description={
          deleteConfirmation.business
            ? t('businesses.deleteConfirmationDescription', {
                businessName:
                  i18n.language === 'ar'
                    ? deleteConfirmation.business.business_name_ar
                    : deleteConfirmation.business.business_name_en,
              }) ||
              `Are you sure you want to delete "${deleteConfirmation.business.business_name_en}"? This action cannot be undone.`
            : ''
        }
        confirmText={t('businesses.delete') || 'Delete'}
        cancelText={t('common.buttons.cancel') || 'Cancel'}
        isLoading={isDeleting}
        icon={<AlertTriangle className="w-6 h-6" />}
      />
    </>
  );
};
