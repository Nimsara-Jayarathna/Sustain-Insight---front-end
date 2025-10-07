import React from 'react';
import ChangePasswordForm from '../../auth/ChangePasswordForm';

interface SecurityTabProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({ onSuccess, onCancel }) => {
  return (
    <ChangePasswordForm
      onSuccess={onSuccess}
      onCancel={onCancel}
    />
  );
};
