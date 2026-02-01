export const contactStatuses = {
  new: {
    label: 'Nuevo',
    value: 'new',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    iconName: 'Plus'
  },
  read: {
    label: 'Leído',
    value: 'read', 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    iconName: 'Eye'
  },
  replied: {
    label: 'Respondido',
    value: 'replied',
    color: 'bg-green-100 text-green-800 border-green-200',
    iconName: 'CheckCircle'
  }
} as const;

export type ContactStatus = keyof typeof contactStatuses;

export const getStatusConfig = (status: ContactStatus) => {
  return contactStatuses[status] || contactStatuses.new;
};

export const getStatusOptions = () => {
  return Object.values(contactStatuses);
};