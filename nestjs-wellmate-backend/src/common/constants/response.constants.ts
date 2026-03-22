export const RESPONSE_MESSAGE_METADATA = 'response_message_metadata';

export const ErrorCodes = {
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  PRISMA_UNIQUE_CONSTRAINT: 'PRISMA_UNIQUE_CONSTRAINT',
  PRISMA_RECORD_NOT_FOUND: 'PRISMA_RECORD_NOT_FOUND',
} as const;

export const ErrorMessages = {
  INTERNAL_SERVER_ERROR: 'An internal server error occurred',
  PROCESSING_ERROR: 'An error occurred while processing your request',
  PRISMA: {
    UNIQUE_CONSTRAINT: 'A record with this value already exists',
    RECORD_NOT_FOUND: 'The requested record was not found',
    OPERATION_FAILED: 'Database operation failed',
  },
  APPOINTMENTS: {
    PAST_TIME_NOT_ALLOWED: 'Cannot book an appointment in the past',
    SCHEDULE_NOT_FOUND: 'Nutritionist schedule not found for this day',
    OUTSIDE_WORKING_HOURS: 'Selected time is outside working hours',
    NUTRITIONIST_ON_LEAVE: 'Nutritionist is on leave at this time',
    TIME_SLOT_TAKEN: 'This time slot is already taken',
    NOT_FOUND: 'Appointment not found',
  },
  PATIENTS: {
    PROFILE_INCOMPLETE: 'Your profile is incomplete. Please complete it first.',
    NOT_FOUND: 'Patient profile not found',
  },
  NUTRITIONISTS: {
    NOT_FOUND_OR_APPROVED: 'Nutritionist not found or not approved',
    NOT_FOUND: 'Nutritionist not found',
  },
  AUTH: {
    FORBIDDEN: 'You do not have permission to perform this action',
  },
} as const;
