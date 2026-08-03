export {
  WHATSAPP_REVIEW_HELPER,
  WHATSAPP_TRIAL_TEMPLATE,
  buildWhatsAppMessage,
  buildWhatsAppProgrammeEnquiryMessage,
  buildWhatsAppProgrammeEnquiryUrl,
  buildWhatsAppTrialUrl,
  getCentralWhatsAppDigits,
  getPrimaryConversionHref,
  getPrimaryConversionLabel,
  SECONDARY_TRIAL_FORM_HREF,
  type WhatsAppTrialFields,
} from "./whatsapp";

export {
  availabilityBranchPromptNeeded,
  buildWhatsAppAvailabilityMessage,
  buildWhatsAppAvailabilityUrl,
  type AvailabilityDeliveryMode,
  type AvailabilityEnquiryFields,
} from "./availability-whatsapp";

export {
  buildWhatsAppPricingMessage,
  buildWhatsAppPricingUrl,
  pricingBranchPromptNeeded,
  resolvePricingDeliveryMode,
  type PricingDeliveryMode,
  type PricingEnquiryFields,
} from "./pricing-whatsapp";

export {
  WHATSAPP_TRAINER_AVAILABILITY_TEMPLATE,
  buildWhatsAppTrainerAvailabilityMessage,
  buildWhatsAppTrainerAvailabilityUrl,
  type TrainerAvailabilityEnquiryFields,
} from "./trainer-whatsapp";
